"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import CreateCuisine from "@/app/(DashboardLayout)/cuisine/create/page"

export default function CuisinesPage() {
    const [cuisines, setCuisines] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({ name: "", isActive: true });
    const [CuisineLoading, setCuisineLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //  GET ALL CUISINES
    const fetchCuisines = async () => {
        try {
            setCuisineLoading(true)
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cuisines`);
            // console.log(res)
            setCuisines(res.data);
        } catch (error) {
            console.error("Error fetching cuisines", error);
        }
        finally {
            setCuisineLoading(false)

        }
    };

    useEffect(() => {
        fetchCuisines();
    }, []);
      //  INSTANT UI UPDATE AFTER CREATE
  const handleCuisineCreated = (newCuisine) => {
    setCuisines((prev) => [newCuisine, ...prev]);
  };
    //Delete the cuisine
    const handleDelete = async (id) => {
        // const result = await Swal.fire({
        //     title: "Are you sure?",
        //     text: "First delete,Menu sections & menu items . Continue?",
        //     icon: "warning",
        //     showCancelButton: true,
        //     confirmButtonText: "Yes, delete",
        //     cancelButtonText: "Cancel",
        // });
        // if (!result.isConfirmed) return;


        setDeletingId(id);

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                toast.error("Please login first");
                return;
            }
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cuisines/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }

            );

            //  Update UI using state (NO refetch needed)
            toast.success("Item deleted successfully");
            setCuisines((prev) => prev.filter((item) => item._id !== id));

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Failed to delete cuisine";
            console.log(error)
            console.log(message)
            toast.error(message);
            // console.error(error);


        } finally {
            setDeletingId(null);
        }
    };


    // EDIT CLICK → GET SINGLE CUISINE
    const handleEdit = async (id) => {
        try {
            setOpen(true);
            setLoading(true);

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cuisines/${id}`);
            setFormData({ name: res.data.name, isActive: res.data.isActive });
            setEditingId(id);
        } catch (error) {
            toast.error("Error fetching cuisine",error);
        } finally {
            setLoading(false);
        }
    };

    // UPDATE CUISINE
    const handleUpdate = async () => {
        if (!editingId) return;

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                toast.error("Please login first");
                return;
            }
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/cuisines/${editingId}`, {
                name: formData.name,
                isActive: formData.isActive
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            setOpen(false);
            setEditingId(null);
            setFormData({ name: "", isActive: true });
           toast.success("cuisine updated successfully")
            fetchCuisines(); // refresh list
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Failed to update cuisine";
            toast.error(message);
            // console.error(error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "500px" }}>
            <div className="d-flex justify-content-between">
                {CuisineLoading ? (<Box display="flex" alignItems="center" gap={2}>
                    <Skeleton variant="text" width={300} height={30} />
                    <Typography variant="body2" color="text.secondary">
                        Loading...
                    </Typography>
                </Box>) : <h2>Cuisines</h2>}
                <IconButton>
                    <AddIcon sx={{ color: "#13DEB9" }}
                        onClick={() => setShowModal(true)}
                    />
                </IconButton>
            </div>


            {/* CUISINE LIST */}
            {cuisines.map((cuisine) => (
                <Box
                    key={cuisine._id}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderBottom: "1px solid #e0e0e0",
                        maxWidth: "500px",
                    }}
                >
                    {/* Left side – Cuisine name */}
                    <Typography sx={{ fontWeight: 500 }}>
                        {cuisine.name}
                    </Typography>

                    {/* Right side – Actions */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                            size="small"
                            sx={{ color: "#13DEB9" }}
                            onClick={() => handleEdit(cuisine._id)}
                        >
                            <EditIcon />
                        </IconButton>

                        <IconButton
                            size="small"
                            sx={{ color: "red" }}
                            onClick={() => handleDelete(cuisine._id)}
                            disabled={deletingId === cuisine._id}
                        >
                            <DeleteIcon />
                        </IconButton>

                    </Box>
                </Box>
            ))}
            <div className="addcuisine">
                {showModal && (
                    <CreateCuisine onClose={() => setShowModal(false)} onCreated={handleCuisineCreated} />
                )}
            </div>

            {/* MODAL */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            width: "300px",
                            borderRadius: "6px",
                        }}
                    >
                        <h3>Edit Cuisine</h3>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    style={{ width: "100%", marginBottom: "10px" }}
                                />
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                    />
                                    Active
                                </label>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button className="btn-cancel" onClick={() => setOpen(false)}>Cancel</button>
                                    <button className="btn-save" onClick={handleUpdate}>Update</button>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
