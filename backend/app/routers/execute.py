from fastapi import APIRouter, Depends, Request, HTTPException
from ..models.execute_models import ExecuteRequest, ExecuteResponse
from ..auth.clerk import verify_clerk_token
from ..sandbox import file_utils, docker_runner, languages

import os

router = APIRouter()

@router.post("/execute", response_model=ExecuteResponse)
async def execute(req: ExecuteRequest, request: Request):
    await verify_clerk_token(request)
    lang = req.language.lower()
    if lang not in languages.LANG_CONFIG:
        raise HTTPException(status_code=400, detail="Unsupported language")
    cfg = languages.LANG_CONFIG[lang]
    tmpdir = file_utils.make_tempdir()
    try:
        filename = cfg["file"](req.filename)
        file_utils.write_file(tmpdir, filename, req.code)
        rc, out, err, timed_out = docker_runner.compile_and_run(lang, tmpdir, filename, timeout=req.timeout or 10)
        return ExecuteResponse(stdout=out, stderr=err, exit_code=rc if rc is not None else None, timed_out=timed_out)
    finally:
        file_utils.cleanup_dir(tmpdir)
