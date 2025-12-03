import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/AdminPanel.tsx
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
export function AdminPanel() {
    const [restaurantName, setRestaurantName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [location, setLocation] = useState('');
    const [priceLevel, setPriceLevel] = useState(2);
    const [imageUrl, setImageUrl] = useState('');
    const [menuItems, setMenuItems] = useState([
        { name: '', price: '', description: '', photoUrl: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const addMenuItem = () => {
        setMenuItems([...menuItems, { name: '', price: '', description: '', photoUrl: '' }]);
    };
    const removeMenuItem = (index) => {
        const updated = menuItems.filter((_, i) => i !== index);
        setMenuItems(updated);
    };
    const updateMenuItem = (index, field, value) => {
        const updated = [...menuItems];
        updated[index] = { ...updated[index], [field]: value };
        setMenuItems(updated);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add restaurant
            const restaurantRef = await addDoc(collection(db, 'restaurants'), {
                name: restaurantName,
                cuisine,
                location,
                priceLevel,
                imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
                averageRating: 0,
                totalRatings: 0,
                createdAt: new Date()
            });
            console.log('Restaurant added with ID:', restaurantRef.id);
            // Add menu items
            let addedCount = 0;
            for (const item of menuItems) {
                if (item.name && item.price) {
                    await addDoc(collection(db, 'restaurants', restaurantRef.id, 'menuItems'), {
                        name: item.name,
                        priceCents: Math.round(parseFloat(item.price) * 100),
                        description: item.description || '',
                        photoUrl: item.photoUrl || '',
                        likes: 0,
                        averageRating: 0,
                        ratingCount: 0,
                        createdAt: new Date()
                    });
                    addedCount++;
                }
            }
            alert(`Success! Added "${restaurantName}" with ${addedCount} menu items!`);
            // Reset form
            setRestaurantName('');
            setCuisine('');
            setLocation('');
            setPriceLevel(2);
            setImageUrl('');
            setMenuItems([{ name: '', price: '', description: '', photoUrl: '' }]);
        }
        catch (error) {
            console.error('Error adding restaurant:', error);
            alert('Error adding restaurant: ' + error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { style: {
            padding: '40px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }, children: [_jsx("h1", { style: { marginBottom: '10px' }, children: "Admin Panel" }), _jsx("p", { style: { color: '#666', marginBottom: '30px' }, children: "Add new restaurants and menu items to Bell-I" }), _jsxs("form", { onSubmit: handleSubmit, style: {
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '30px',
                    background: 'white'
                }, children: [_jsx("h2", { style: { marginBottom: '20px', fontSize: '20px' }, children: "Restaurant Information" }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '5px', fontWeight: '500' }, children: "Restaurant Name *" }), _jsx("input", { type: "text", value: restaurantName, onChange: (e) => setRestaurantName(e.target.value), placeholder: "e.g., Chipotle", required: true, style: {
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                } })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '5px', fontWeight: '500' }, children: "Cuisine Type *" }), _jsx("input", { type: "text", value: cuisine, onChange: (e) => setCuisine(e.target.value), placeholder: "e.g., Mexican, American, Chinese", required: true, style: {
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                } })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '5px', fontWeight: '500' }, children: "Location *" }), _jsx("input", { type: "text", value: location, onChange: (e) => setLocation(e.target.value), placeholder: "e.g., Green Street, Campustown", required: true, style: {
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                } })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '5px', fontWeight: '500' }, children: "Price Level *" }), _jsxs("select", { value: priceLevel, onChange: (e) => setPriceLevel(Number(e.target.value)), style: {
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }, children: [_jsx("option", { value: 1, children: "$ - Budget Friendly" }), _jsx("option", { value: 2, children: "$$ - Moderate" }), _jsx("option", { value: 3, children: "$$$ - Expensive" })] })] }), _jsxs("div", { style: { marginBottom: '30px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '5px', fontWeight: '500' }, children: "Image URL (optional)" }), _jsx("input", { type: "url", value: imageUrl, onChange: (e) => setImageUrl(e.target.value), placeholder: "https://example.com/image.jpg", style: {
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                } }), _jsx("small", { style: { color: '#666', fontSize: '12px' }, children: "Tip: Search for the restaurant on Unsplash and copy the image URL" })] }), _jsxs("div", { style: {
                            borderTop: '2px solid #eee',
                            paddingTop: '20px',
                            marginTop: '20px'
                        }, children: [_jsx("h2", { style: { marginBottom: '20px', fontSize: '20px' }, children: "Menu Items" }), menuItems.map((item, index) => (_jsxs("div", { style: {
                                    marginBottom: '20px',
                                    padding: '15px',
                                    background: '#f9f9f9',
                                    borderRadius: '6px',
                                    position: 'relative'
                                }, children: [_jsxs("div", { style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }, children: [_jsxs("strong", { style: { fontSize: '14px' }, children: ["Item ", index + 1] }), menuItems.length > 1 && (_jsx("button", { type: "button", onClick: () => removeMenuItem(index), style: {
                                                    background: '#ff4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '5px 10px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }, children: "Remove" }))] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }, children: [_jsx("input", { type: "text", placeholder: "Item name (e.g., Burrito Bowl)", value: item.name, onChange: (e) => updateMenuItem(index, 'name', e.target.value), style: {
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                } }), _jsx("input", { type: "number", step: "0.01", placeholder: "Price (e.g., 10.50)", value: item.price, onChange: (e) => updateMenuItem(index, 'price', e.target.value), style: {
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                } })] }), _jsx("input", { type: "text", placeholder: "Description (optional)", value: item.description, onChange: (e) => updateMenuItem(index, 'description', e.target.value), style: {
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            marginBottom: '10px'
                                        } }), _jsx("input", { type: "url", placeholder: "Photo URL (optional)", value: item.photoUrl, onChange: (e) => updateMenuItem(index, 'photoUrl', e.target.value), style: {
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        } })] }, index))), _jsx("button", { type: "button", onClick: addMenuItem, style: {
                                    padding: '10px 20px',
                                    background: '#f0f0f0',
                                    border: '2px dashed #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }, children: "+ Add Another Menu Item" })] }), _jsx("button", { type: "submit", disabled: loading, style: {
                            marginTop: '30px',
                            padding: '12px 30px',
                            background: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            width: '100%'
                        }, children: loading ? 'Adding Restaurant...' : 'Add Restaurant to Bell-I' })] })] }));
}
