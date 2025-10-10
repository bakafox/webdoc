from fastapi import BackgroundTasks, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from io import BytesIO
from PIL import Image, ImageOps
from pathlib import Path
from random import randint
import os

# Запуск: fastapi run backend.py

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/posts")
def posts():
    posts = [
        {
            'id': 1,
            'title': 'Эмперические рассуждения о невидимом и неумолимом течении времени',
            'body': 'Всю свою жизнь человек сталкивается со временем через изменения — '
                    + 'телесные, природные, социальные. Мы не ощущаем время, но видим, '
                    + 'как "вчерашнее" отличается от "сегодняшнего": как желтеют листья '
                    + 'на деревьях, как на лице проступают первые морщины, как природа '
                    + 'стирает всё созданное человеком, будь то песочный замок на берегу '
                    + 'моря или города древних цивилизаций, "растворившихся" в прошлом.'
        },
        {
            'id': 2,
            'title': 'fgsfds',
            'body': 'Изменение — это вообще единственный феномен, через может быть нами '
                    + 'засвидетельствован как явление времени. Каждая секунда для человека — '
                    + 'это "сейчас", лишь промелькнувшая перед глазами и уже безвозвратно '
                    + 'ушедшая в "прошлое". Эмпирически невозможно уловить момент времени '
                    + 'в чистом виде: сам акт его восприятия требует длительности, и потому '
                    + 'любое наблюдение изменений во времени есть наблюдение его протекания, '
                    + 'следовательно его возникновения и неминуемого исчезновения.'
        },
        {
            'id': 3,
            'title': 'ывыфваыфваппп'
        },
        {
            'id': 4,
            'title': 'алиса что делать если снится какойто желтый кот'
        },
        {
            'id': 5,
            'title': 'САТА АНДАГИ!!! САТА АНДАГИ!!!',
            'body': 'Просто жареное тесто, сказала Томо? Но ведь и человек — он как тесто. '
                    + 'Мы рождаемся мягкими комками сознания, и жизнь нас… жарит. В масле '
                    + 'времени. И кто знает, станет ли кто-то хрустящим снаружи, но мягким '
                    + 'внутри, или просто пережарится? Когда я впервые услышала это слово, '
                    + 'я подумала, что это имя какого-то бога! Но потом оказалось, что это '
                    + 'еда. И тогда я подумала, а вдруг всё наоборот: это не люди придумали '
                    + 'SATA ANDAGI, а SATA ANDAGI придумали людей, чтобы было кому их есть?'
        },
        {
            'id': 6,
            'title': 'Ну вот, теперь я хочу сата андаги…',
            'body': '…но, может быть, Я УЖЕ И ЕСТЬ сата андаги??'
        },
    ]
    return JSONResponse(posts, status_code=200)

# https://stackoverflow.com/questions/65408109/how-do-i-receive-image-and-json-data-in-fastapi
# https://www.getorchestra.io/guides/fastapi-working-with-request-files
# https://stackoverflow.com/questions/55873174/how-do-i-return-an-image-in-fastapi
@app.post("/image")
async def image(file: UploadFile = File(...), background: BackgroundTasks = None):
    try:
        print('ФАЙЛ:', file.filename)
        
        img_raw = await file.read()
        img = Image.open(BytesIO(img_raw)).convert('RGB')
        img_res = ImageOps.invert(img)

        img_path = Path(Path(__file__).parent / f'{randint(1000, 9999)}.png')
        img_res.save(img_path)
        background.add_task(os.remove, img_path)

        return FileResponse(
            path=img_path,
            media_type='image/png',
            filename=f'res_{file.filename}',
            status_code=200,
        )
    except:
        return JSONResponse(
            {"error": "Картинка имеет несовместимый тип или повреждена"},
            status_code=400,
        )

