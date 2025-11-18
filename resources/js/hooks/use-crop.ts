import { Area } from 'react-easy-crop'

const createImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
})

export const getCroppedImage = async (
    imgSrc: string,
    pixelCrop: Area,
    width: number,
    height: number,
) : Promise<Blob|null> => {
    const image = await createImage(imgSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    canvas.width = width
    canvas.height = height

    ctx.drawImage(
        image, 
        pixelCrop.x, 
        pixelCrop.y, 
        pixelCrop.width, 
        pixelCrop.height, 
        0, 
        0, 
        canvas.width, 
        canvas.height
    )

    return new Promise((resolve) => {
        canvas.toBlob((f) => {
            if (f !== null) {
                resolve(f)
            }
        }, 'image/jpeg')
    })
}