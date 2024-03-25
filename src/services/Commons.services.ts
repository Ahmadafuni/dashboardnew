import axios from "axios";

// Download PDF
export const downLoadFile = async (path: string) => {
  try {
    const file = await axios.get(path, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([file.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `template.${file.data.type.split("/")[1]}`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {}
};
