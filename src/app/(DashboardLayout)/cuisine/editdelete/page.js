"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function CuisinesPage() {
    const [cuisines, setCuisines] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({ name: "" });

    //  GET ALL CUISINES
    const fetchCuisines = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cuisines`);
            // console.log(res)
            setCuisines(res.data);
        } catch (error) {
            console.error("Error fetching cuisines", error);
        }
    };

    useEffect(() => {
        fetchCuisines();
    }, []);
    //Delete the cuisine
    const handleDelete = async (id) => {
        if (typeof window === "undefined") return;
        const confirmDelete = window.confirm(
            "This will delete cuisine, sections & menu items. Continue?"
        );
        if (!confirmDelete) return;

        setDeletingId(id);

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cuisines/${id}`
            );

            //  Update UI using state (NO refetch needed)
            setCuisines((prev) => prev.filter((item) => item._id !== id));

        } catch (error) {
            alert(error.response?.data?.message || "Delete failed");
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
            setFormData({ name: res.data.name });
            setEditingId(id);
        } catch (error) {
            console.error("Error fetching cuisine", error);
        } finally {
            setLoading(false);
        }
    };

    // UPDATE CUISINE
    const handleUpdate = async () => {
        if (!editingId) return;

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/cuisines/${editingId}`, {
                name: formData.name,
            });

            setOpen(false);
            setEditingId(null);
            setFormData({ name: "" });

            fetchCuisines(); // refresh list
        } catch (error) {
            console.error("Error updating cuisine", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Cuisines</h2>

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
                            sx={{ color: "green" }}
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
                                        setFormData({ name: e.target.value })
                                    }
                                    style={{ width: "100%", marginBottom: "10px" }}
                                />

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button className="btn-save" onClick={handleUpdate}>Update</button>
                                    <button className="btn-cancel" onClick={() => setOpen(false)}>Cancel</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
