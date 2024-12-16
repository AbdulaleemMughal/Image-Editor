import { useState } from "react";
import {
  filterElements,
  ImageInterface,
  PropertyInterface,
} from "../Object/filterButton";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../style/main.scss";
import { GrRotateLeft, GrRotateRight } from "react-icons/gr";
import { CgMergeHorizontal, CgMergeVertical } from "react-icons/cg";
import { IoIosImage } from "react-icons/io";

export const Main = () => {
  const [property, setProperty] = useState<PropertyInterface | null>({
    name: "brightness",
    maxValue: 200,
  });
  const [image, setImage] = useState<ImageInterface | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [detail, setDetail] = useState<HTMLImageElement | null>(null);

  const defaultImageState: Omit<ImageInterface, "image"> = {
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vertical: 1,
    horizontal: 1,
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setImage({
          image: reader.result as string,
          ...defaultImageState,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const leftRotate = () => {
    if (image) {
      setImage({
        ...image,
        rotate: image.rotate - 90,
      });
    }
  };

  const rightRotate = () => {
    if (image) {
      setImage({
        ...image,
        rotate: image.rotate + 90,
      });
    }
  };

  const veriticalFlip = () => {
    if (image) {
      setImage({
        ...image,
        vertical: image.vertical === 1 ? -1 : 1,
      });
    }
  };

  const horizontalFlip = () => {
    if (image) {
      setImage({
        ...image,
        horizontal: image.horizontal === 1 ? -1 : 1,
      });
    }
  };

  const imageCrop = () => {
    if (!detail || !crop || !crop.width || !crop.height) {
      console.error("Invalid crop or image details");
      return;
    }

    const canvas = document.createElement("canvas");
    const scaleX = detail.naturalWidth / detail.width;
    const scaleY = detail.naturalHeight / detail.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    ctx.drawImage(
      detail,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Url = canvas.toDataURL("image/jpeg");

    setImage({
      ...image,
      image: base64Url,
      ...defaultImageState,
    });
  };

  const saveImage = () => {
    if (!detail || !image) {
      console.error("Invalid image details");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = detail.naturalWidth;
    canvas.height = detail.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    ctx.filter = `
      brightness(${image.brightness}%) 
      grayscale(${image.grayscale}%) 
      sepia(${image.sepia}%) 
      saturate(${image.saturate}%) 
      contrast(${image.contrast}%) 
      hue-rotate(${image.hueRotate}deg)
    `;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((image.rotate * Math.PI) / 180);
    ctx.scale(image.horizontal, image.vertical);

    ctx.drawImage(
      detail,
      -detail.naturalWidth / 2,
      -detail.naturalHeight / 2,
      detail.naturalWidth,
      detail.naturalHeight
    );

    const link = document.createElement("a");
    link.download = "edited_image.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  };

  const resetFilters = () => {
    setImage({
      ...image!,
      ...defaultImageState,
    });
  };
  

  return (
    <>
      <div className="image_editor">
        <div className="card">
          <div className="card-header">
            <h2>-----Image Editor-----</h2>
          </div>
          <div className="card-body">
            <div className="sidebar">
              <div className="side-body">
                <div className="filter-section">
                  <span>Filter</span>
                  <div className="filter-key">
                    {filterElements.map((v, i) => (
                      <button
                        className={property?.name === v.name ? "active" : ""}
                        key={i}
                        onClick={() =>
                          setProperty({
                            ...property,
                            name: v.name,
                          })
                        }
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-slider">
                  <div className="label-bar">
                    <label htmlFor="range">{property?.name}</label>
                    <span>
                      {image
                        ? image[property?.name as keyof ImageInterface] + "%"
                        : "0%"}
                    </span>
                  </div>
                  {image && property && (
                    <input
                      type="range"
                      max={property.maxValue}
                      value={image[property.name as keyof ImageInterface]}
                      onChange={(e) =>
                        setImage({
                          ...image,
                          [property.name as keyof ImageInterface]: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  )}
                </div>
                <div className="rotate">
                  <label htmlFor="">Rotate & Flip</label>
                  <div className="icon">
                    <div onClick={leftRotate}>
                      <GrRotateLeft />
                    </div>
                    <div onClick={rightRotate}>
                      <GrRotateRight />
                    </div>
                    <div onClick={veriticalFlip}>
                      <CgMergeVertical />
                    </div>
                    <div onClick={horizontalFlip}>
                      <CgMergeHorizontal />
                    </div>
                  </div>
                </div>
              </div>
              <div className="reset">
                <button onClick={resetFilters}>Reset</button>
                <button className="save" onClick={saveImage}>
                  Save Image
                </button>
              </div>
            </div>
            <div className="image-section">
              <div className="image">
                {image?.image ? (
                  <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                    <img
                      onLoad={(e) =>
                        setDetail(e.currentTarget as HTMLImageElement)
                      }
                      style={{
                        filter: `
                      brightness(${image?.brightness}%) 
                      grayscale(${image?.grayscale}%) 
                      sepia(${image?.sepia}%) 
                      saturate(${image?.saturate}%) 
                      contrast(${image?.contrast}%) 
                      hue-rotate(${image?.hueRotate}deg)
                    `,
                        transform: `rotate(${image?.rotate}deg) scale(${image?.horizontal}, ${image?.vertical})`,
                      }}
                      src={image?.image}
                      alt="Edited Preview"
                    />
                  </ReactCrop>
                ) : (
                  <label htmlFor="choose">
                    <IoIosImage />
                    <span>Choose Image</span>
                  </label>
                )}
              </div>
              <div className="image-select">
                {crop && (
                  <button className="crop" onClick={imageCrop}>
                    Crop Image
                  </button>
                )}

                <label htmlFor="choose">Choose Image</label>
                <input onChange={handleImage} type="file" id="choose" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
