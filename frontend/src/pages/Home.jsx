const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Posts */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {[1, 2, 3].map((post) => (
          <div
            key={post}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              Blog Title
            </h2>
            <p className="text-gray-700 mb-3">
              This is a short description of the blog post.
            </p>
            <button className="text-blue-600">
              Read more
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
