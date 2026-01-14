"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
export const cuisineSchema = yup.object({
  name: yup.string().required("Cuisine name is required").min(2),
  description: yup.string().max(200),
  isActive: yup.boolean(),
});

const CreateCuisine = ({ onClose, onCreated }) => {
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

  //
  useEffect(() => {
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }
     const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cuisines`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Cuisine created successfully");
      onCreated(res.data);
      reset();
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to create cuisine";

      toast.error(message);
    }

  };

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Cuisine</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Cuisine Name</label>
                  <input
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("name")}
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
                    rows={3}
                  />
                </div>

                {/* Active */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("isActive")}
                  />
                  <label className="form-check-label">Active</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Cuisine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/*  Correct Backdrop */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default CreateCuisine;



