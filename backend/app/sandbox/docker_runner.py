import subprocess
import os
from typing import List, Tuple
from .languages import LANG_CONFIG

def _build_docker_cmd(
    image: str,
    workdir: str,
    bind_host_dir: str,
    container_cmd: List[str],
    mem: str = "256m",
    cpus: str = "0.5",
    network_disabled: bool = True,
) -> List[str]:
    cmd = [
        "docker",
        "run",
        "--rm",
        "--network",
        "none" if network_disabled else "bridge",
        "--memory",
        mem,
        "--cpus",
        cpus,
        "--pids-limit",
        "64",
        "--log-driver",
        "none",
        "-v",
        f"{bind_host_dir}:{workdir}:rw",
        "-w",
        workdir,
    ]
    cmd += [image]
    cmd += container_cmd
    return cmd

def run_in_docker(image: str, host_dir: str, workdir: str, cmd: List[str], timeout: int = 30) -> Tuple[int, str, str]:
    docker_cmd = _build_docker_cmd(image, workdir, host_dir, cmd)
    env = os.environ.copy()
    env["DOCKER_HOST"] = "tcp://dind:2375"
    proc = subprocess.run(docker_cmd, input=None, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=timeout,env=env)
    return proc.returncode, proc.stdout, proc.stderr

def compile_and_run(lang: str, tmpdir: str, filename: str, timeout: int = 30):
    cfg = LANG_CONFIG[lang]
    image = cfg["image"]
    workdir = "/workspace"
    if lang == "cpp":
        exe_name = "main_exec"
        compile_cmd = cfg["compile"](filename, exe_name)
        rc, out, err = run_in_docker(image, tmpdir, workdir, compile_cmd, timeout=30)
        if rc != 0:
            return rc, out, err, False
        run_cmd = cfg["run"](exe_name)
        rc, out, err = run_in_docker(image, tmpdir, workdir, run_cmd, timeout=timeout)
        return rc, out, err, False
    if lang == "java":
        compile_cmd = cfg["compile"](filename)
        rc, out, err = run_in_docker(image, tmpdir, workdir, compile_cmd, timeout=20)
        if rc != 0:
            return rc, out, err, False
        class_name = os.path.splitext(filename)[0]
        run_cmd = cfg["run"](class_name)
        rc, out, err = run_in_docker(image, tmpdir, workdir, run_cmd, timeout=timeout)
        return rc, out, err, False
    run_cmd = cfg["run"](filename)
    rc, out, err = run_in_docker(image, tmpdir, workdir, run_cmd, timeout=timeout)
    return rc, out, err, False
