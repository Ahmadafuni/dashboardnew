import  { useState } from 'react';
import { PlusCircleIcon, MinusCircleIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form} from "@/components/ui/form";

interface Props {
    form: any;
    onSubmit: any;
}

const ManufacturingStageForm = ({ form, onSubmit }: Props) => {
    const [steps, setSteps] = useState([
        {
            stageNumber: '1',
            stageName: '',
            workDescription: '',
            duration: '',
            description: '',
            departmentId: ''
        }
    ]);

    const handleStepChange = (index, field, value) => {
        setSteps(prevSteps => {
            const updatedSteps = [...prevSteps];
            updatedSteps[index][field] = value;
            return updatedSteps;
        });
    };

    const handleAddStep = (e) => {
        e.preventDefault();
        const nextStageNumber = (steps.length + 1).toString();
        setSteps(prevSteps => [
            ...prevSteps,
            {
                stageNumber: nextStageNumber,
                stageName: '',
                workDescription: '',
                duration: '',
                description: '',
                departmentId: ''
            }
        ]);
    };

    const handleDeleteStep = (e, index) => {
        e.preventDefault();
        setSteps(prevSteps => {
            const updatedSteps = [...prevSteps];
            updatedSteps.splice(index, 1);
            return updatedSteps;
        });
    };

    const handleMoveUp = (e, index) => {
        e.preventDefault();
        if (index === 0) return;
        setSteps(prevSteps => {
            const updatedSteps = [...prevSteps];
            const temp = updatedSteps[index];
            updatedSteps[index] = updatedSteps[index - 1];
            updatedSteps[index - 1] = temp;
            return updatedSteps;
        });
    };

    const handleMoveDown =  (e, index) => {
        e.preventDefault();
        if (index === steps.length - 1) return;
        setSteps(prevSteps => {
            const updatedSteps = [...prevSteps];
            const temp = updatedSteps[index];
            updatedSteps[index] = updatedSteps[index + 1];
            updatedSteps[index + 1] = temp;
            return updatedSteps;
        });
    };

    return (
        <Form {...form}>
            <form >

        <div>
            {steps.map((step, index) => (
                <Card key={index} style={{ backgroundColor: 'var(--background)'}}>
                    <CardHeader style={{ color: 'var(--foreground)' }}>
                        <h2 className="text-lg font-semibold">Stage {index + 1}</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Stage Name"
                                value={step.stageName}
                                onChange={e => handleStepChange(index, 'stageName', e.target.value)}
                                className="form-input"
                            />
                            <input
                                type="text"
                                placeholder="Work Description"
                                value={step.workDescription}
                                onChange={e => handleStepChange(index, 'workDescription', e.target.value)}
                                className="form-input"
                            />
                            <input
                                type="text"
                                placeholder="Duration"
                                value={step.duration}
                                onChange={e => handleStepChange(index, 'duration', e.target.value)}
                                className="form-input"
                            />
                            <input
                                type="text"
                                placeholder="Department ID"
                                value={step.departmentId}
                                onChange={e => handleStepChange(index, 'departmentId', e.target.value)}
                                className="form-input"
                            />
                            <textarea
                                placeholder="Description"
                                value={step.description}
                                onChange={e => handleStepChange(index, 'description', e.target.value)}
                                className="form-input"
                            />
                        </div>
                    </CardContent>
                    <div className="flex justify-end items-center p-4">
                        {index !== 0 && (
                            <button onClick={() => handleMoveUp(index)} className="focus:outline-none mr-2"><ArrowUpIcon /></button>
                        )}
                        {index !== steps.length - 1 && (
                            <button onClick={() => handleMoveDown(index)} className="focus:outline-none mr-2"><ArrowDownIcon /></button>
                        )}
                        <button onClick={() => handleDeleteStep(index)} className="focus:outline-none mr-2"><MinusCircleIcon /></button>
                    </div>
                </Card>
            ))}
            <div className="flex justify-center mt-4">
                <button onClick={handleAddStep} className="focus:outline-none mr-2">
                    <PlusCircleIcon  />
                </button>
            </div>
        </div>
            </form>
        </Form>

    );
};

export default ManufacturingStageForm;
