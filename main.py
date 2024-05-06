from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

#requestbody로 받으려면 class 지정, 받는쪽 정의
class Memo(BaseModel):
    id:int
    content:str
    

memos = []

app = FastAPI()


#post 요청을 /memos 경로로 받았을때, 메모추가 함수
@app.post('/memos')
async def create_memo(memo:Memo): #requestbody memo로 들어옴, 정의된값memo를 Memo에 받음
    memos.append(memo) #배열에 추가
    return {"message": "메모가 생성되었습니다.", "memo": memo()}


#get요청 받음
@app.get("/memos")
def read_memo():
    return memos
    

app.mount("/", StaticFiles(directory="static", html=True), name="static")