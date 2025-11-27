import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
    });

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
            setShowProductForm(false);
            fetchProducts();
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        try {
            await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE',
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleDeleteUser = async (id: string, email: string) => {
        const isSelfDelete = user?.id === id;

        const confirmMessage = isSelfDelete
            ? `⚠️ WARNING: You are about to delete your own account (${email})!\n\nThis will:\n• Log you out immediately\n• Permanently delete your account\n• Cannot be undone\n\nAre you absolutely sure?`
            : `Are you sure you want to delete the user "${email}"?\n\nThis action cannot be undone.`;

        if (!confirm(confirmMessage)) return;

        try {
            await fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'DELETE',
            });

            // If user deleted themselves, log them out immediately
            if (isSelfDelete) {
                logout();
            } else {
                fetchUsers();
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">
                        Manage products and users.
                    </p>
                </div>

                <div className="flex gap-2 border-b">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'products'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'users'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Users
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div className="space-y-4">
                        <Button onClick={() => setShowProductForm(!showProductForm)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>

                        {showProductForm && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>New Product</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateProduct} className="space-y-4">
                                        <Input
                                            label="Name"
                                            value={newProduct.name}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, name: e.target.value })
                                            }
                                            required
                                        />
                                        <Input
                                            label="Description"
                                            value={newProduct.description}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, description: e.target.value })
                                            }
                                            required
                                        />
                                        <Input
                                            label="Price"
                                            type="number"
                                            step="0.01"
                                            value={newProduct.price}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, price: e.target.value })
                                            }
                                            required
                                        />
                                        <Input
                                            label="Image URL"
                                            value={newProduct.imageUrl}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, imageUrl: e.target.value })
                                            }
                                            required
                                        />
                                        <Button type="submit">Create Product</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b last:border-0">
                                                <td className="px-6 py-4">{product.name}</td>
                                                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'users' && (
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((userItem) => (
                                        <tr key={userItem.id} className="border-b last:border-0">
                                            <td className="px-6 py-4">{userItem.email}</td>
                                            <td className="px-6 py-4">{userItem.name}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${userItem.role === 'ADMIN'
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-muted text-muted-foreground'
                                                        }`}
                                                >
                                                    {userItem.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
