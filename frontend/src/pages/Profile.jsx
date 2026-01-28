const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold text-center">
          Profile
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded shadow flex flex-col items-center">
          <img
            src="https://via.placeholder.com/120"
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover mb-3"
          />

          <button className="text-sm text-blue-600 mb-4">
            Change Avatar
          </button>

          <div className="w-full max-w-md space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                disabled
                value="User Name"
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                disabled
                value="@username"
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                value="user@email.com"
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            My Posts
          </h2>

          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div
                key={post}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">
                    Blog Title
                  </h3>
                  <p className="text-sm text-gray-600">
                    Short blog description...
                  </p>
                </div>

                <div className="space-x-3">
                  <button className="text-blue-600 text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
