import "./App.css";
import { useEffect, useRef } from 'react';
import * as React from 'react';
import * as fabric from 'fabric'; // v6
import DownloadJSON from './DownloadJSON';

export interface LabeledRectProps extends fabric.RectProps {
  label: string;
}

export class LabeledRect extends fabric.Rect {
  options: Partial<LabeledRectProps>;
  label: string;

  constructor(options: Partial<LabeledRectProps>) {
    super(options);
    this.options = options || {};
    this.label = this.options.label || '';

  }

  setLabel(label: string) {
    this.label = label;
    this.options.label = label;
  }
  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    ctx.font = '15px Helvetica';
    ctx.fillStyle = 'black';
    ctx.fillText(this.label, -this.width/2 + 20, -this.height/2 + 20);
  }
};

export const App = () => {
  const [canvas, setCanvas] = React.useState<fabric.Canvas>();
  const [selectedObject, setSelectedObject] = React.useState<LabeledRect>();
  const [snapshotJSON, setSnapshotJSON] = React.useState<string>('');
  const [loadedJSON, setLoadedJSON] = React.useState<string>('');
  const labelInputRef = useRef();
  const occupiedInputRef = useRef();

  useEffect(() => {
    const options = { 
      width: 1000,
      height: 500,
      backgroundColor: 'gray'
      };
    const canvas = new fabric.Canvas('canvas', options);
    canvas.selectionColor = 'rgba(0,255,0,0.3)';
    canvas.selectionBorderColor = 'red';
    canvas.selectionLineWidth = 5;
    canvas.on("mouse:down", handleMouseDown);

    setCanvas(canvas);
    canvas.renderAll();

    return () => {
      canvas.dispose();
    }
  }, []);

  const addSquare = (parentCanvas: fabric.Canvas) => {
    const shape = new LabeledRect({
      top: 50,
      left: 50,
      height: 80,
      width: 80,
      strokeWidth: 1,
      stroke: 'blue',
      fill: 'white',
      label: 'Table'
    });

    parentCanvas.add(shape);
    parentCanvas.renderAll();
  }

  const addDiamond = (parentCanvas: fabric.Canvas) => {
    const shape = new LabeledRect({
      top: 50,
      left: 50,
      height: 80,
      width: 80,
      strokeWidth: 1,
      stroke: 'blue',
      fill: 'white',
      angle: -45,
      label: 'Table'
    });
    parentCanvas.add(shape);
    parentCanvas.renderAll();
  }

  const clearCanvas = (parentCanvas: fabric.Canvas) => {
    parentCanvas.remove(...parentCanvas.getObjects());
    setSelectedObject(undefined);
    labelInputRef.current.value = '';
    occupiedInputRef.current.value = '';
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (event.target) {
      let target: LabeledRect = event.target as unknown as LabeledRect;
      setSelectedObject(target);
      labelInputRef.current.value = target.label;
      occupiedInputRef.current.value = target.options.fill === 'green' ? 'y' : 'n';
      console.log(event.target);
    } else {
      setSelectedObject(undefined);
    }
  }

  const deleteSelection = (parentCanvas: fabric.Canvas, obj: LabeledRect) => {
    if (obj) {
      parentCanvas.remove(obj);
      setSelectedObject(undefined);
    }
  }

  const takeSnapshotJSON = (parentCanvas: fabric.Canvas) => {
    let json = JSON.stringify(parentCanvas.toObject(['label']));
    setSnapshotJSON(json);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log("e.target.result", e.target.result);
      setLoadedJSON(e.target.result);
    };
  }

  const restoreFromLoadedFile = (parentCanvas: fabric.Canvas) => {
    let arrOriginal = [];
    let arr = [];
    parentCanvas.loadFromJSON(loadedJSON, function(o, object) {
      arrOriginal.push(object);
      arr.push(new LabeledRect(o));
    }).then(
      (parentCanvas) =>
      {
        for (var item of arrOriginal) {
          parentCanvas.remove(item);
        }

        for (var item of arr) {
          parentCanvas.add(item);
        }
        parentCanvas.requestRenderAll();
      }
      );
  }

  const handleSubmit = (event) => {
    let opt = selectedObject.options;
    if (labelInputRef.current.value) {
      opt.label = labelInputRef.current.value;
    }
    if (occupiedInputRef.current.value === 'y') {
      opt.fill = 'green';
    }
    if (occupiedInputRef.current.value === 'n') {
      opt.fill = 'white';
    }
    opt.left = selectedObject.left;
    opt.top = selectedObject.top;

    let obj = new LabeledRect(opt);
    canvas.remove(selectedObject);
    canvas.add(obj);
    setSelectedObject(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    event.preventDefault();
  };

  return(
    <div className='Canvas'>
      <h1>Restaurant Layout</h1>
      <div className='Buttons'>
        <button onClick={() => addSquare(canvas)}>Square</button>
        <button onClick={() => addDiamond(canvas)}>Diamond</button>
        <button onClick={() => clearCanvas(canvas)}>Clear Canvas</button>
        <button onClick={() => deleteSelection(canvas, selectedObject)}>Delete Selection</button>
        <button onClick={() => takeSnapshotJSON(canvas, selectedObject)}>Snapshot JSON</button>
        <DownloadJSON data={snapshotJSON} fileName="canvasJSON" />
        <input type="file" onChange={handleChange} />
        <button onClick={() => restoreFromLoadedFile(canvas)}>Restore From Loaded File</button>

      </div>

      <div>
        <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
          <h2>Table Properties</h2>
          <label style={{ marginRight: '10px' }}>
            Label:
            <input type="text" ref={labelInputRef} style={{ marginLeft: '5px' }} />
          </label>
          <label style={{ marginRight: '10px' }}>
            Occupied (y/n):
            <input type="text" ref={occupiedInputRef} style={{ marginLeft: '5px' }} />
          </label>
          <button type="submit" style={{ display: 'block', marginTop: '10px' }}>
            Update
          </button>
        </form>
      </div>

      <div>
        <canvas id="canvas" />
      </div>
    </div>
  );
};

export default App;
