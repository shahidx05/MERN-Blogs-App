import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Editprofile } from "../services/api";
import { MdCameraAlt, MdPerson, MdAlternateEmail, MdErrorOutline } from "react-icons/md";

const EditProfile = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth()

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState('')
    const [img, setImg] = useState('')
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadData = () => {
        if (user) {
            setName(user.name)
            setUsername(user.username)
            setEmail(user.email)
            setImg(user.profile_img);
            setBio(user.bio || "")
        }
    }

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImg(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        setError('');
        if (!name || !username) {
            setError("Name and username are required.");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("username", username);
            formData.append("bio", bio);
            if (file) formData.append("profile_img", file);

            const res = await Editprofile(formData);
            if (res.success) {
                setUser(res.user);
                navigate("/profile");
            } else {
                setError(res.message || "Update failed.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData()
    }, [user])


    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-lg mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        Edit Profile
                    </h1>
                    <Link
                        to="/profile"
                        className="text-sm hover:underline"
                        style={{ color: 'var(--color-text-link)' }}
                    >
                        ← Back
                    </Link>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl border p-6 space-y-5"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                >
                    {/* Error */}
                    {error && (
                        <div
                            className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
                                color: 'var(--color-error)',
                                border: '1px solid color-mix(in srgb, var(--color-error) 25%, transparent)',
                            }}
                        >
                            <MdErrorOutline size={16} />
                            {error}
                        </div>
                    )}

                    {/* Avatar */}
                    <div className="flex flex-col items-center pb-2">
                        <div className="relative">
                            <img
                                src={img}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-4"
                                style={{ borderColor: 'var(--color-bg-card)', boxShadow: '0 0 0 3px var(--color-primary)' }}
                            />
                            <label
                                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                                title="Change avatar"
                            >
                                <MdCameraAlt size={14} />
                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                            </label>
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                            Click the icon to change avatar
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Full Name
                        </label>
                        <div className="relative">
                            <MdPerson size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Your name"
                                className="input-field pl-9"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Username
                        </label>
                        <div className="relative">
                            <MdAlternateEmail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="your_username"
                                className="input-field pl-9"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Bio
                        </label>
                        <textarea
                            className="input-field resize-none"
                            rows={3}
                            placeholder="Tell us about yourself..."
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            maxLength={200}
                        />
                        <p className="text-xs text-right" style={{ color: 'var(--color-text-muted)' }}>
                            {bio.length}/200
                        </p>
                    </div>

                    {/* Email — read only */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            disabled
                            className="input-field"
                            value={email}
                            style={{
                                backgroundColor: 'var(--color-border)',
                                color: 'var(--color-text-muted)',
                                cursor: 'not-allowed',
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-1">
                        <Link
                            to="/profile"
                            className="px-4 py-2 text-sm font-medium rounded-lg border"
                            style={{
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-secondary)',
                                backgroundColor: 'var(--color-bg-input)',
                            }}
                        >
                            Cancel
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-5 py-2 text-sm font-semibold rounded-lg"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-text-inverse)',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;