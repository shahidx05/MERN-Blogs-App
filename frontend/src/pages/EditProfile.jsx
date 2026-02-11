import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Editprofile } from "../services/api";

const EditProfile = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth()
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [img, setImg] = useState('')
    const [file, setFile] = useState(null)

    const loadData = () => {
        if (user) {
            setName(user.name)
            setUsername(user.username)
            setEmail(user.email)
            setImg(user.profile_img);
        }
    }

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImg(URL.createObjectURL(selectedFile));
        }
    }

    const handleSubmit = async () => {
        if (!name || !username) {
            alert("All fields are required");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("username", username);
            if (file) {
                formData.append("profile_img", file);
            }

            const res = await Editprofile(formData)
            if (res.success) {
                setUser(res.user);
                navigate("/profile");
            } else {
                alert(res.message || "Update failed");
            }

        } catch (error) {
            alert("something went wrong")
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    }, [user])


    if (!user) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-xl mx-auto p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Edit Profile</h1>
                    <Link
                        to="/profile"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        ← Back to Profile
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded shadow p-6 space-y-6">

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                        <img
                            src={img || "https://res.cloudinary.com/dcezxzzxo/image/upload/v1769693349/posts/ch40q2asunurvlf1ljod.jpg"}
                            alt="profile_img"
                            className="w-28 h-28 rounded-full object-cover border mb-3"
                        />

                        <label className="text-sm text-blue-600 hover:underline cursor-pointer">
                            Change Avatar
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="username"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            disabled
                            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                            value={email}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            to="/profile"
                            className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </Link>

                        <button className="bg-black text-white px-5 py-2 text-sm rounded hover:bg-gray-800"
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditProfile;