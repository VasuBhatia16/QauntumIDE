from pydantic import BaseModel

class ExecuteRequest(BaseModel):
    language: str
    code: str
    filename: str | None = None
    stdin: str | None = None
    timeout: int | None = 10

class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int | None
    timed_out: bool
