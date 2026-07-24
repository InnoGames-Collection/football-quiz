from PIL import Image
import os
import glob

input_dir = '../dist/assets/animation'
output_dir = '../public/assets/animation'

os.makedirs(output_dir, exist_ok=True)
files = glob.glob(os.path.join(input_dir, '*.png'))

for f in files:
    try:
        img = Image.open(f).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            if item[0] < 15 and item[1] < 15 and item[2] < 15:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        basename = os.path.basename(f).replace('.png.png', '.png')
        out_path = os.path.join(output_dir, basename)
        img.save(out_path, "PNG")
        print(f"Saved {basename} ({img.width}x{img.height})")
    except Exception as e:
        print(f"Error on {f}: {e}")
