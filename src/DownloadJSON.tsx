import { Button } from "@mui/material";

const DownloadJSON = ({data, fileName}) => {
  const downloadJSON = () => {
    const jsonData = new Blob([data], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement('a');
    link.href = jsonURL;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={downloadJSON}>Download JSON</Button>
  );
}

export default DownloadJSON;