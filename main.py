from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/form", response_class=HTMLResponse)
def form():
    return "<html><body><h1>hello world</h1></body></html>"
