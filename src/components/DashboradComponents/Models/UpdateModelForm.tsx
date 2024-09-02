import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import {Button} from "@/components/ui/button";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {
    newProductCatalogueModal,
    productCatalogueList,
} from "@/store/ProductCatalogue";
import {
    newProductCategoryOneModal,
    productCategoryOneList,
} from "@/store/ProductCategoryOne";
import {
    newProductCategoryTwoModal,
    productCategoryTwoList,
} from "@/store/ProductCategoryTwo";
import {templateList} from "@/store/Template";
import {newTextileModal, textileList} from "@/store/Textiles";
import {Plus, Trash} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useState} from "react";
import {useDropzone} from "react-dropzone";

interface Props {
    form: any;
    onSubmit: any;
    handleFileChange: any;
}

interface FileWithPreview extends File {
    preview: string;
}


export default function UpdateModelForm({
                                            form,
                                            onSubmit,
                                            handleFileChange,
                                        }: Props) {
    const {t} = useTranslation();

    // Dropdown state
    const categoryOneList = useRecoilValue(productCategoryOneList);
    const categoryTwoList = useRecoilValue(productCategoryTwoList);
    const templatesList = useRecoilValue(templateList);
    const textilesList = useRecoilValue(textileList);
    const productCataloguesList = useRecoilValue(productCatalogueList);

    // Modals States
    const setNewCategoryOneModal = useSetRecoilState(newProductCategoryOneModal);
    const setNewCategoryTwoModal = useSetRecoilState(newProductCategoryTwoModal);
    const setNewTextileModal = useSetRecoilState(newTextileModal);
    const setNewProductCatalogueModal = useSetRecoilState(newProductCatalogueModal);

    // Image Upload State
    const [images, setImages] = useState<FileWithPreview[]>([]);

    // Dropzone setup for image uploads with restrictions
    const {getRootProps, getInputProps} = useDropzone({
        accept: {'image/*': []}, // Only accept image files
        maxSize: 5 * 1024 * 1024, // Set max file size to 5MB
        onDrop: (acceptedFiles, fileRejections) => {
            // Handle rejected files
            if (fileRejections.length > 0) {
                fileRejections.forEach((rejection) => {
                    const {file, errors} = rejection;
                    errors.forEach((error) => {
                        if (error.code === "file-too-large") {
                            alert(`The file ${file.name} is too large. Max size is 5MB.`);
                        } else if (error.code === "file-invalid-type") {
                            alert(`The file ${file.name} is not an accepted image format.`);
                        }
                    });
                });
            }

            // Handle accepted files
            const newImages = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setImages((prevImages) => [...prevImages, ...newImages]);
            handleFileChange({target: {files: [...images, ...acceptedFiles]}}); // Send updated files to parent
        },
    });

    // Handle removal of images
    const handleRemoveImage = (index: number) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1); // Remove selected image
        setImages(updatedImages);
        handleFileChange({target: {files: updatedImages}}); // Send updated files to parent
    };

    const handleSubmit = async (data: any) => {
        await onSubmit(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid grid-cols-2 gap-2"
                id="model-update"
            >
                <FormField
                    control={form.control}
                    name="DemoModelNumber"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder="Enter model number"
                            label={t("ModelNumber")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="CategoryOne"
                    render={({field}) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("ProductCategoryOne")}
                                placeholder="Search Category One..."
                                emptyBox="No category one found"
                                form={form}
                                name="CategoryOne"
                                selectText="Select Category One"
                                items={categoryOneList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewCategoryOneModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="CategoryTwo"
                    render={({field}) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("ProductCategoryTwo")}
                                placeholder="Search Category Two..."
                                emptyBox="No category two found"
                                form={form}
                                name="CategoryTwo"
                                selectText="Select Category Two"
                                items={categoryTwoList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewCategoryTwoModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ProductCatalog"
                    render={({field}) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("ProductCatalogues")}
                                placeholder="Search Product Catalogue..."
                                emptyBox="No product catalogue one found"
                                form={form}
                                name="ProductCatalog"
                                selectText="Select Product Catalogue"
                                items={productCataloguesList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewProductCatalogueModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ModelName"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ModelName")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Template"
                    render={({field}) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("Template")}
                                placeholder="Search Template..."
                                emptyBox="No template found"
                                form={form}
                                name="Template"
                                selectText="Select Template"
                                items={templatesList}
                            />
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="Textile"
                    render={({field}) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("Textiles")}
                                placeholder="Search Textile..."
                                emptyBox="No textile found"
                                form={form}
                                name="Textile"
                                selectText="Select Textile"
                                items={textilesList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewTextileModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="Characteristics"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Characteristics")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Barcode"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Barcode")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="LabelType"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("LabelType")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="PrintName"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("PrintName")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="PrintLocation"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("PrintLocation")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Description"
                    render={({field}) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Description")}
                            field={field}
                        />
                    )}
                />

                <FormItem className="col-span-2">
                    <FormLabel>{t("Images")}</FormLabel>
                    <div
                        {...getRootProps({
                            className:
                                "border-dashed border-2 p-4 cursor-pointer rounded-md",
                        })}
                    >
                        <input {...getInputProps()} />
                        <p>{t("DragMessage")}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {images.map((file, index) => (
                            <div key={file.name} className="relative">
                                <img
                                    src={file.preview}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-600 hover:text-white"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <Trash className="h-4 w-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                </FormItem>
            </form>
        </Form>
    );
}
