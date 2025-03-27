import React, { useState, useEffect } from "react";
import { Search, Users, Bookmark, Code, Microscope, Calculator, Music, Palette, BookOpen, ArrowRightCircle, Loader2 } from "lucide-react";
import { collection, getDocs, updateDoc, doc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "firebase/auth";

interface Server {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  iconUrl?: string;
  coverUrl?: string;
  membersCount: number;
  color: string;
  createdAt: string;
  owner: string;
  members: string[];
}

interface ExploreProps {
  user: User | null;
  onJoinServer: (serverId: string) => Promise<void>;
  servers: Server[];
}

export default function Explore({ user, onJoinServer, servers }: ExploreProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "all", name: "🌍 All Communities", color: "from-blue-500 to-purple-600" },
    { id: "tech", name: "💻 Tech & Code", color: "from-cyan-500 to-blue-600" },
    { id: "academic", name: "📚 Academics", color: "from-green-500 to-emerald-600" },
    { id: "arts", name: "🎨 Arts & Culture", color: "from-pink-500 to-rose-600" },
    { id: "science", name: "🔬 Science", color: "from-violet-500 to-purple-600" },
    { id: "sports", name: "⚽ Sports", color: "from-orange-500 to-red-600" }
  ];

  const handleJoinServer = async (serverId: string) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    setIsLoading(true);
    try {
      await onJoinServer(serverId);
    } catch (error) {
      console.error("Error joining server:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServers = servers.filter((server) => {
    const matchesCategory = selectedCategory === "all" || server.color.includes(selectedCategory);
    const matchesSearch = 
      searchQuery === "" ||
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Discover Communities</h1>
        <p className="text-gray-400">
          Join communities that match your interests and connect with like-minded peers
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities by name or description..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2e2e2e] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-500/20"
                  : "bg-[#2e2e2e] text-gray-300 hover:bg-[#363636] hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServers.map((server) => {
          const isMember = server.members.includes(user?.uid || '');
          const gradientColor = categories.find(c => server.color.includes(c.id))?.color || categories[0].color;
          
          return (
            <div 
              key={server.id} 
              className="bg-[#2e2e2e] rounded-xl overflow-hidden group hover:transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border border-gray-800 hover:border-teal-500/30"
            >
              {/* Server Cover */}
              <div className={`relative h-48 bg-gradient-to-br ${gradientColor}`}>
                {server.coverUrl && (
                  <img
                    src={server.coverUrl}
                    alt={server.name}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                )}
                {server.iconUrl ? (
                  <img
                    src={server.iconUrl}
                    alt={`${server.name} icon`}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl object-cover border-4 border-[#2e2e2e]"
                  />
                ) : (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-[#2e2e2e] flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{server.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/90 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{server.membersCount.toLocaleString()}</span>
                </div>
              </div>

              {/* Server Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">
                    {server.name}
                  </h3>
                  <button className="p-2 hover:bg-[#363636] rounded-lg text-gray-400 hover:text-teal-400 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {server.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="px-3 py-1.5 bg-[#363636] rounded-lg text-gray-400">
                    Created {new Date(server.createdAt).toLocaleDateString()}
                  </span>
                  {isMember ? (
                    <span className="flex items-center gap-2 text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      Joined
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-teal-400">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                      Open to Join
                    </span>
                  )}
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => !isMember && handleJoinServer(server.id)}
                disabled={isMember || isLoading}
                className={`w-full py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${isMember 
                    ? "bg-green-500/10 text-green-400 cursor-default"
                    : "bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white"
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isMember ? (
                  <>
                    <Users className="w-5 h-5" />
                    Member
                  </>
                ) : (
                  <>
                    Join Community
                    <ArrowRightCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredServers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-[#2e2e2e] rounded-full flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No communities found</h3>
          <p className="text-gray-400 max-w-md">
            Try adjusting your search or filters to find the perfect community for you
          </p>
        </div>
      )}
    </div>
  );
}