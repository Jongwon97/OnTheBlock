import { client, clientWithTokenAndMedia } from "./client";

const SessionUploadURL = "/videos/upload/check";

export const registSession = async (data, file, thumbnail) => {
  
  const formData = new FormData();
  formData.append(
    "video",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  const fileName = "filename";
  const videoExtension = file.type.split('/').pop();
  formData.append("file", file, `${fileName}.${videoExtension}`);
  formData.append("thumbnail", thumbnail, `${fileName}.png`);

  return clientWithTokenAndMedia()
    .post(SessionUploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      alert(error);
      return null;
    });;
};
