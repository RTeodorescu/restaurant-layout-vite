import "./App.css";
import * as React from 'react';
import * as fabric from 'fabric'; // v6
import DownloadJSON from './DownloadJSON';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface UserInput {
  label: string;
  section: string;
  occupied: boolean;
}

const defaultValues: UserInput = {
  label: "",
  section: "",
  occupied: false,
};

const validationSchema = yup.object({
  label: yup
    .string()
    .required("Label is required")
    .max(10, "Label is too long - max 10"),
  section: yup
    .string()
    .required("Section is required")
    .max(10, "Section is too long - max 10"),
  occupied: yup
    .boolean(),
});

export interface LabeledRectProps extends fabric.RectProps {
  label: string;
  section: string;
  occupied: boolean;
  customType: string;
}

export interface LabeledEllipseProps extends fabric.EllipseProps {
  label: string;
  section: string;
  occupied: boolean;
  customType: string;
}

export class LabeledRect extends fabric.Rect {
  options: Partial<LabeledRectProps>;
  label: string;
  section: string;
  occupied: boolean;
  customType: string;

  constructor(options: Partial<LabeledRectProps>) {
    super(options);
    this.options = options || {};
    this.label = this.options.label || '';
    this.section = this.options.section || '';
    this.occupied = this.options.occupied || false;
    this.customType = this.options.customType || '';
  }

  setLabel(label: string) {
    this.label = label;
    this.options.label = label;
  }

  setSection(section: string) {
    this.section = section;
    this.options.section = section;
  }

  setOccupied(occupied: boolean) {
    this.occupied = occupied;
    this.options.occupied = occupied;
  }

  setCustomType(customType: string) {
    this.customType = customType;
    this.options.customType = customType;
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    ctx.font = '15px Helvetica';
    ctx.fillStyle = 'black';
    ctx.fillText(this.section + '-' + this.label, -this.width/2 + 20, -this.height/2 + 20);
  }
};

export class LabeledEllipse extends fabric.Ellipse {
  options: Partial<LabeledEllipseProps>;
  label: string;
  section: string;
  occupied: boolean;
  customType: string;

  constructor(options: Partial<LabeledEllipseProps>) {
    super(options);
    this.options = options || {};
    this.label = this.options.label || '';
    this.section = this.options.section || '';
    this.occupied = this.options.occupied || false;
    this.customType = this.options.customType || '';
  }

  setLabel(label: string) {
    this.label = label;
    this.options.label = label;
  }

  setSection(section: string) {
    this.section = section;
    this.options.section = section;
  }

  setOccupied(occupied: boolean) {
    this.occupied = occupied;
    this.options.occupied = occupied;
  }

  setCustomType(customType: string) {
    this.customType = customType;
    this.options.customType = customType;
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    ctx.font = '15px Helvetica';
    ctx.fillStyle = 'black';
    ctx.fillText(this.section + '-' + this.label, -this.width/2 + 50, -this.height/2 + 50);
  }
};

export const App = () => {
  const [canvas, setCanvas] = React.useState<fabric.Canvas>();
  const [selectedObject, setSelectedObject] = React.useState<fabric.FabricObject>();
  const [snapshotJSON, setSnapshotJSON] = React.useState<string>('');
  const [loadedJSON, setLoadedJSON] = React.useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors }, // get errors of the form
    setValue,
  } = useForm<UserInput>({
    defaultValues,
    resolver: yupResolver<UserInput>(validationSchema as yup.ObjectSchema<UserInput>),
    mode: "onTouched", // default is "onSubmit"
  })

  React.useEffect(() => {
    const options = { 
      width: 1000,
      height: 500,
      backgroundColor: 'gray'
      };
    const canvas = new fabric.Canvas('canvas', options);
    canvas.selectionColor = 'rgba(0,255,0,0.3)';
    canvas.selectionBorderColor = 'red';
    canvas.selectionLineWidth = 5;
    canvas.on("mouse:down", (event) => {
      handleMouseDown(event as unknown as React.MouseEvent)
    });

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
      label: 'Table',
      section: 'S',
      occupied: false,
      customType: 'square/LabeledRect'
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
      label: 'Table',
      section: 'S',
      occupied: false,
      customType: 'diamond/LabeledRect'
    });
    parentCanvas.add(shape);
    parentCanvas.renderAll();
  }

  const addCircle = (parentCanvas: fabric.Canvas) => {
    const shape = new LabeledEllipse({
      top: 50,
      left: 50,
      rx: 25,
      ry: 25,
      strokeWidth: 1,
      stroke: 'blue',
      fill: 'white',
      label: 'Table',
      section: 'S',
      occupied: false,
      customType: 'circle/LabeledEllipse'
    });

    parentCanvas.add(shape);
    parentCanvas.renderAll();
  }

  const clearCanvas = (parentCanvas: fabric.Canvas) => {
    parentCanvas.remove(...parentCanvas.getObjects());
    setSelectedObject(undefined);
    setValue("label", defaultValues.label);
    setValue("section", defaultValues.section);
    setValue("occupied", defaultValues.occupied);
  }

  const handleMouseDown = (event: React.MouseEvent) => {
      if (event.target && 
        (event.target instanceof LabeledRect || event.target instanceof LabeledEllipse )
      ) {
        let target: fabric.FabricObject = event.target as unknown as fabric.FabricObject;

        setSelectedObject(target);
        if (target instanceof LabeledRect || target instanceof LabeledEllipse) {
          setValue("label", target.label);
          setValue("section", target.section);
          // setValue("occupied", target.options.fill === 'green' ? true : false);
          setValue("occupied", target.occupied);
        }
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
    let json = JSON.stringify(parentCanvas.toObject(['label', 'section', 'occupied', 'customType']));
    setSnapshotJSON(json);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files) {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e && e.target && e.target.result) {
          console.log("e.target.result", e.target.result);
          setLoadedJSON(e.target.result as string);
        }
      }
    };
  }

  const restoreFromLoadedFile = (parentCanvas: fabric.Canvas) => {
    let arrOriginal: fabric.Rect[] = [];
    let arr: LabeledRect[] = [];
    parentCanvas.loadFromJSON(loadedJSON, function(o, object) {
      arrOriginal.push(object as fabric.Rect);
      arr.push(new LabeledRect(o));
    }).then(
      (parentCanvas) =>
      {
        for (let item of arrOriginal) {
          parentCanvas.remove(item);
        }

        for (let item of arr) {
          parentCanvas.add(item);
        }
        parentCanvas.requestRenderAll();
      }
      );
  }

  const onSubmitHandler = (userInput: UserInput) => {
    console.log('Submitted');
    console.table(userInput);
    if(canvas && selectedObject && 
      (selectedObject instanceof LabeledRect || selectedObject instanceof LabeledEllipse )) {
        let opt = selectedObject.options;
        opt.label = userInput.label;
        opt.section = userInput.section;
        opt.occupied = userInput.occupied;
        if (userInput.occupied === true) {
          opt.fill = 'green';
        } else {
          opt.fill = 'white';
        }
        opt.left = selectedObject.left;
        opt.top = selectedObject.top;

        let obj = null;
        if (selectedObject instanceof LabeledRect) {
          obj = new LabeledRect(opt);
        }
        if (selectedObject instanceof LabeledEllipse) {
          obj = new LabeledEllipse(opt);
        }

        if (obj){
          canvas.remove(selectedObject);
          canvas.add(obj);
          setSelectedObject(obj);
          canvas.setActiveObject(obj);
          canvas.renderAll();
        }
    }
  }

  return(
    <main className='main prose'>
      <h1>Restaurant Layout</h1>
      <div className='form grid-cols-3'>
        <button onClick={() => addSquare(canvas as fabric.Canvas)}>Square</button>
        <button onClick={() => addDiamond(canvas as fabric.Canvas)}>Diamond</button>
        <button onClick={() => addCircle(canvas as fabric.Canvas)}>Circle</button>
        <button onClick={() => clearCanvas(canvas as fabric.Canvas)}>Clear Canvas</button>
        <button onClick={() => deleteSelection(canvas as fabric.Canvas, selectedObject as LabeledRect)}>Delete Selection</button>
        <button onClick={() => takeSnapshotJSON(canvas as fabric.Canvas)}>Snapshot JSON</button>
        <DownloadJSON data={snapshotJSON} fileName="canvasJSON" />
        <input type="file" onChange={handleChange} />
        <button onClick={() => restoreFromLoadedFile(canvas as fabric.Canvas)}>Restore From Loaded File</button>

      </div>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="form">
        <div className="group">
          <label htmlFor="label">Label:</label>
          <input {...register("label")} id="label" type="text" placeholder="Label"/>
          {errors.label && (
            <p className="error-message">{errors.label.message}</p>
          )}
        </div>

        <div className="group">
          <label htmlFor="section">Section:</label>
          <input {...register("section")} id="section" type="text" placeholder="Section"/>
          {errors.section && (
            <p className="error-message">{errors.section.message}</p>
          )}
        </div>

        <div className="group">
        <label htmlFor="section">Occupied:</label>
          <input
            {...register("occupied")}
            id="occupied"
            type="checkbox"
          />
          {errors.occupied && (
            <p className="error-message">{errors.occupied.message}</p>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>

      <div>
        <canvas id="canvas" />
      </div>
    </main>
  );
};

export default App;
