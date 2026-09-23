from io import BytesIO
from PIL import Image

from django.core.files.uploadedfile import SimpleUploadedFile

def create_test_image():
    image = Image.new("RGB",(100,100))
    buffer = BytesIO()

    image.save(buffer, format="JPEG")
    buffer.seek(0)

    return SimpleUploadedFile(
        name="candidate.jpeg",
        content=buffer.read(),
        content_type="image/jpeg"
    )
