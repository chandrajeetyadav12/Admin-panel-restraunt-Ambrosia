"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import CreateCuisine from "@/app/(DashboardLayout)/cuisine/create/page"
import CreateMenuSecModal from "@/app/(DashboardLayout)/menuSection/createSection/page"
import CreateMenuItemModal from "@/app/(DashboardLayout)/menuItem/createMenuItem/page"
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
export default function AdminMenuPage() {
    const [showModal, setShowModal] = useState(false);
    const [showMenuSectionModal, setshowMenuSectionModal] = useState(false);
    const [showMenuItemsModal, setshowMenuItemsModal] = useState(false);


    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    /* ================= STATE ================= */
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [menuData, setMenuData] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        subcategory: "",
        section: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const [CuisineLoading, setCuisineLoading] = useState(false);

    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    /* ================= LOAD CUISINES ================= */
    useEffect(() => {
        const loadCuisines = async () => {
            try {
                setCuisineLoading(true)
                const res = await axios.get(`${BASE_URL}/api/cuisines`);
                setCuisines(res.data);
                if (res.data.length > 0) {
                    handleCuisineSelect(res.data[0]);
                }
            } catch {
                setError("Failed to load cuisines");
            }
            finally {
                setCuisineLoading(false)

            }
        };
        loadCuisines();
    }, []);

    /* ================= LOAD MENU ================= */
    const handleCuisineSelect = async (cuisine) => {
        try {
            setSelectedCuisine(cuisine);
            setLoading(true);
            const res = await axios.get(
                `${BASE_URL}/api/menu/menu-structure/${cuisine._id}`
            );
            setMenuData(res.data);
        } catch {
            setError("Failed to load menu");
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setCancelling(true);

        setTimeout(() => {
            setEditingItem(null);
            setCancelling(false);
        }, 300); // small delay for smooth UX
    };

    /* ================= DELETE ================= */
    const handleDeleteItem = async (itemId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This item will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                toast.error("Please login first");
                return;
            }
            await axios.delete(`${BASE_URL}/api/menuItems/${itemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            handleCuisineSelect(selectedCuisine);
            toast.success("Item deleted successfully");
        } catch (error) {
            let message = "Failed to delete menu items";

            if (error.response?.data?.message) {
                message = error.response.data.message; // backend message
            } else if (error.message) {
                message = error.message; // axios / JS error
            }

            toast.error(message);
        }
        finally {
            setDeletingId(null);
        }

    };

    /* ================= EDIT ================= */
    const openEditModal = (item, sectionId) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price,
            subcategory: item.subcategory || "",
            section: sectionId,
            image: null,
        });
    };

    const handleUpdateItem = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                toast.error("Please login first");
                return;
            }
            setSaving(true);
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price);
            data.append("subcategory", formData.subcategory);
            data.append("section", formData.section);
            if (formData.image) data.append("image", formData.image);

            await axios.put(
                `${BASE_URL}/api/menuItems/${editingItem._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                
            );
            toast.success("Menu items updated successfully");
            setEditingItem(null);
            handleCuisineSelect(selectedCuisine);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Failed to update menu items";
            toast.error(message);
            // console.error(error);
        }
        finally {
            setSaving(false);
        }

    };

    /* ================= UI ================= */
    return (
        <div className="admin-container">
            <div className="d-flex justify-content-between">
                <h2 className="heading">Menu Items</h2>
                <IconButton size="large">
                    <AddIcon
                        sx={{ color: "#13DEB9" }}
                        onClick={() => setshowMenuItemsModal(true)}
                    />
                </IconButton>
            </div>


            <div className="addcuisine">
                {showModal && (
                    <CreateCuisine onClose={() => setShowModal(false)} />
                )}
            </div>
            <div className="addmenusection">
                {showMenuSectionModal && (
                    <CreateMenuSecModal onClose={() => setshowMenuSectionModal(false)} />
                )}
            </div>
            <div className="addmenuitems">
                {showMenuItemsModal && (
                    <CreateMenuItemModal onClose={() => setshowMenuItemsModal(false)} />
                )}
            </div>

            {error && <p className="error">{error}</p>}

            {/* CUISINES */}

            <div className="">
                {CuisineLoading ?
                    (<Box display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="text" width={300} height={30} />
                        <Typography variant="body2" color="text.secondary">
                            Loading...
                        </Typography>
                    </Box>) : <h5 className="my-4  normalheading">Select a cuisine to edit and delete menu items</h5>}
                <ul className="cuisine-list">
                    {cuisines.map((c) => (
                        <li
                            key={c._id}
                            className={`cuisine-btn ${selectedCuisine?._id === c._id ? "active" : ""
                                }`}
                            onClick={() => handleCuisineSelect(c)}
                        >
                            {c.name}
                        </li>
                    ))}
                </ul>

            </div>

            {loading && (<Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="text" width={300} height={30} />
                <Typography variant="body2" color="text.secondary">
                    Loading...
                </Typography>
            </Box>)}

            {/* MENU */}
            {menuData &&
                menuData.sections.map((section) => (
                    <div key={section.sectionId}>
                        {/* <h3>{section.sectionName}</h3> */}

                        {Object.entries(section.items).map(([sub, items]) => (
                            <div key={sub}>
                                <h5 className="my-2">{sub}</h5>

                                {items.map((item) => (
                                    <div className="menu-item" key={item._id}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="menu-img"
                                        />

                                        <div className="menu-info">
                                            <b>{item.name}</b> – ₹{item.price}
                                        </div>
                                        <IconButton
                                            sx={{ color: "#13DEB9" }}
                                            onClick={() =>
                                                openEditModal(item, section.sectionId)
                                            }
                                        >
                                            <EditIcon>Edit</EditIcon>
                                        </IconButton>

                                        <IconButton
                                            sx={{ color: "red" }}
                                            onClick={() => handleDeleteItem(item._id)}
                                        >
                                            <DeleteIcon
                                            >
                                                {deletingId === item._id ?
                                                    "Deleting..."
                                                    :
                                                    "Delete"
                                                }
                                            </DeleteIcon>
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}

            {/* MODAL */}
            {editingItem && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Edit Menu Item</h3>

                        <input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Name"
                        />

                        <input
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({ ...formData, price: e.target.value })
                            }
                            placeholder="Price"
                        />

                        <input
                            type="file"
                            onChange={(e) =>
                                setFormData({ ...formData, image: e.target.files[0] })
                            }
                        />

                        <div className="modal-actions ">
                            <button className="btn-save" onClick={handleUpdateItem}>
                                {saving ? "saving..." : "Save"}
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={handleCancel}
                            >
                                {cancelling ? "cancelling..." : "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
