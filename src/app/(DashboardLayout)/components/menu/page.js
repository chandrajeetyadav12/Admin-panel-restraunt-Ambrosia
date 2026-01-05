"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function AdminMenuPage() {
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
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    /* ================= LOAD CUISINES ================= */
    useEffect(() => {
        const loadCuisines = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/cuisine`);
                setCuisines(res.data);
                if (res.data.length > 0) {
                    handleCuisineSelect(res.data[0]);
                }
            } catch {
                setError("Failed to load cuisines");
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
        if (!confirm("Delete this item?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/menuItems/${itemId}`);
            handleCuisineSelect(selectedCuisine);
        } catch (error) {
            console.error(error);
            alert("Failed to delete item");
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
            setSaving(true);
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price);
            data.append("subcategory", formData.subcategory);
            data.append("section", formData.section);
            if (formData.image) data.append("image", formData.image);

            await axios.put(
                `${BASE_URL}/api/menuItems/${editingItem._id}`,
                data
            );

            setEditingItem(null);
            handleCuisineSelect(selectedCuisine);
        } catch (error) {
            console.error(error);
        }
        finally {
            setSaving(false);
        }

    };

    /* ================= UI ================= */
    return (
        <div className="admin-container">
            <h1>Menu Management</h1>

            {error && <p className="error">{error}</p>}

            {/* CUISINES */}
            <div className="cuisine-list">
                {cuisines.map((c) => (
                    <button
                        key={c._id}
                        className={`cuisine-btn ${selectedCuisine?._id === c._id ? "active" : ""
                            }`}
                        onClick={() => handleCuisineSelect(c)}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {loading && <p>Loading menu...</p>}

            {/* MENU */}
            {menuData &&
                menuData.sections.map((section) => (
                    <div key={section.sectionId}>
                        {/* <h3>{section.sectionName}</h3> */}

                        {Object.entries(section.items).map(([sub, items]) => (
                            <div key={sub}>
                                <h4>{sub}</h4>

                                {items.map((item) => (
                                    <div className="menu-item" key={item._id}>
                                        <img
                                            //   src={`${BASE_URL}${item.image}`}
                                            src={item.image}
                                            alt={item.name}
                                            className="menu-img"
                                        />

                                        <div className="menu-info">
                                            <b>{item.name}</b> – ₹{item.price}
                                        </div>
                                        <EditIcon
                                        sx={{color:"green"}}
                                        onClick={() =>
                                            openEditModal(item, section.sectionId)
                                        }>Edit</EditIcon>
                                      
                                        <DeleteIcon
                                        sx={{ color: "red" }}
                                        onClick={() => handleDeleteItem(item._id)}
                                        >
                                            {deletingId === item._id ?
                                                "Deleting..."
                                                :
                                                "Delete"
                                            }
                                        </DeleteIcon>
                                       
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
