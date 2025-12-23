"use client"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
export const cuisineSchema = yup.object({
    name: yup
        .string()
        .required("Cuisine name is required")
        .min(2, "Name must be at least 2 characters"),

    description: yup
        .string()
        .max(200, "Description should not exceed 200 characters"),

    isActive: yup.boolean(),
});
const CreateCuisine = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(cuisineSchema),
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
        },
    });

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cuisine`,
            data
        );
        reset();
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">Add Cuisine</h5>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Cuisine Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                {...register("name")}
                                placeholder="Enter cuisine name"
                            />
                            <div className="invalid-feedback">
                                {errors.name?.message}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className={`form-control ${errors.description ? "is-invalid" : ""
                                    }`}
                                {...register("description")}
                                placeholder="Optional description"
                                rows={3}
                            />
                            <div className="invalid-feedback">
                                {errors.description?.message}
                            </div>
                        </div>

                        {/* isActive */}
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isActive"
                                {...register("isActive")}
                            />
                            <label className="form-check-label" htmlFor="isActive">
                                Active
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Cuisine"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCuisine;
