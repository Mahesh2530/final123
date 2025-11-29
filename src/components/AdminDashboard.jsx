"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Upload, LogOut, Trash2, BookOpen, FileText, File, TrendingUp, Star, MessageCircle } from "lucide-react"
import { addResource, getResources, deleteResource, initializeDB, getReviews } from "../utils/supabasedb"

export function AdminDashboard({ userName, onLogout, userEmail }) {
  const [resources, setResources] = useState([])
  const [reviews, setReviews] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("textbooks")
  const [fileName, setFileName] = useState("")
  const [fileData, setFileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB()
        const savedResources = await getResources()
        const savedReviews = await getReviews()
        setResources(savedResources)
        setReviews(savedReviews)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Error loading data:", error)
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file")
        return
      }

      if (file.size > 1024 * 1024 * 1024) {
        alert("File size must be less than 1GB")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setFileData({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          data: event.target.result,
        })
        setFileName(file.name)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleUpload = async () => {
    if (!title.trim() || !description.trim() || !fileData) {
      alert("Please fill all fields and select a PDF file")
      return
    }

    const newResource = {
      id: Date.now().toString(),
      title,
      description,
      category,
      fileName: fileData.name,
      fileSize: fileData.size,
      fileData: fileData.data,
      uploadedDate: new Date().toLocaleDateString(),
      uploadedBy: userEmail,
      uploaderName: userName,
      hasRedFlag: false,
    }

    try {
      await addResource(newResource)
      const updatedResources = await getResources()
      setResources(updatedResources)
      setTitle("")
      setDescription("")
      setFileName("")
      setFileData(null)
      alert("PDF uploaded successfully!")
    } catch (error) {
      console.error("[v0] Error uploading PDF:", error)
      alert("Error uploading PDF. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id)
        const updatedResources = await getResources()
        setResources(updatedResources)
      } catch (error) {
        console.error("[v0] Error deleting resource:", error)
        alert("Error deleting resource. Please try again.")
      }
    }
  }

  const categories = ["textbooks", "research-papers", "study-guides", "lecture-notes", "videos"]

  const getMyResources = () => {
    return resources.filter((resource) => resource.uploadedBy === userEmail)
  }

  const getResourceReviews = (resourceId) => {
    return reviews.filter((review) => review.resourceId === resourceId)
  }

  const getAverageRating = (resourceId) => {
    const resourceReviews = getResourceReviews(resourceId)
    if (resourceReviews.length === 0) return 0
    const sum = resourceReviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / resourceReviews.length).toFixed(1)
  }

  const getMyAverageRating = () => {
    const myResources = getMyResources()
    if (myResources.length === 0) return 0
    let totalRating = 0
    let totalReviews = 0
    myResources.forEach((resource) => {
      const resourceReviews = getResourceReviews(resource.id)
      resourceReviews.forEach((review) => {
        totalRating += review.rating
        totalReviews++
      })
    })
    return totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0
  }

  const getCategoryDistribution = () => {
    const categories = {}
    const myCategories = {}
    resources.forEach((resource) => {
      categories[resource.category] = (categories[resource.category] || 0) + 1
      if (resource.uploadedBy === userEmail) {
        myCategories[resource.category] = (myCategories[resource.category] || 0) + 1
      }
    })
    return Object.entries(categories).map(([category, total]) => ({
      category,
      total,
      mine: myCategories[category] || 0,
      percentage: ((total / resources.length) * 100).toFixed(1),
    }))
  }

  const getMyResourcesPerformance = () => {
    return getMyResources().map((resource) => ({
      ...resource,
      rating: parseFloat(getAverageRating(resource.id)),
      reviewCount: getResourceReviews(resource.id).length,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-red-600 rounded-full mx-auto mb-4"></div>
          <p className="text-red-600 font-bold text-lg">Loading your library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 border-b-4 border-yellow-400 shadow-2xl animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onLogout}
              variant="outline"
              className="bg-yellow-400 text-red-600 hover:bg-yellow-500 font-bold border-2 border-red-600 shadow-lg hover-scale hover-shadow"
            >
              ← Back
            </Button>
            <div className="bg-yellow-400 p-3 rounded-lg shadow-lg animate-pulse-gentle">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edulibrary Admin</h1>
              <p className="text-sm text-yellow-100 font-semibold">Welcome, {userName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-yellow-400 text-red-600 hover:bg-yellow-500 font-bold flex items-center gap-2 shadow-lg hover-scale hover-shadow"
            >
              <TrendingUp className="w-4 h-4" />📊 Analytics
            </Button>
            <Button
              onClick={onLogout}
              className="bg-white text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 shadow-lg hover-scale hover-shadow border-2 border-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Analytics Dashboard Section */}
        {showAnalytics && (
          <div className="space-y-6 mb-8 animate-fade-in">
            {/* Statistics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-xl border-4 border-red-400 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover-lift animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-red-600 mb-1">My Uploads</p>
                      <p className="text-3xl font-black text-red-900">{getMyResources().length}</p>
                    </div>
                    <Upload className="w-12 h-12 text-red-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-4 border-orange-400 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover-lift animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-orange-600 mb-1">Total Resources</p>
                      <p className="text-3xl font-black text-orange-900">{resources.length}</p>
                    </div>
                    <BookOpen className="w-12 h-12 text-orange-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-4 border-purple-400 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover-lift animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-purple-600 mb-1">Total Reviews</p>
                      <p className="text-3xl font-black text-purple-900">{reviews.length}</p>
                    </div>
                    <MessageCircle className="w-12 h-12 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-4 border-yellow-400 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover-lift animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-yellow-600 mb-1">My Avg Rating</p>
                      <p className="text-3xl font-black text-yellow-900">{getMyAverageRating()}</p>
                    </div>
                    <Star className="w-12 h-12 text-yellow-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Resources Performance */}
            <Card className="shadow-xl border-4 border-green-400 rounded-xl bg-gradient-to-br from-green-50 to-yellow-50 animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-green-500 to-yellow-500">
                <CardTitle className="flex items-center gap-2 text-white text-xl font-bold">
                  <TrendingUp className="w-5 h-5" />
                  📊 My Resources Performance
                </CardTitle>
                <CardDescription className="text-green-100 font-semibold">
                  Track how your uploaded resources are performing
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getMyResourcesPerformance().map((resource, idx) => (
                    <div
                      key={resource.id}
                      className={`p-4 rounded-lg border-2 shadow-md hover-lift animate-fade-in ${
                        resource.hasRedFlag
                          ? "bg-gradient-to-br from-red-50 to-red-100 border-red-500"
                          : "bg-gradient-to-br from-white to-green-50 border-green-400"
                      }`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {resource.hasRedFlag && (
                        <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                          ⚠️ RED FLAG
                        </div>
                      )}
                      <h4 className="font-bold text-gray-900 mb-2 truncate text-sm">{resource.title}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-yellow-600">
                            {resource.rating > 0 ? resource.rating : "No reviews"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-blue-600">{resource.reviewCount} reviews</span>
                        </div>
                        {resource.rating > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${
                                resource.hasRedFlag
                                  ? "bg-gradient-to-r from-red-400 to-red-600"
                                  : "bg-gradient-to-r from-yellow-400 to-green-500"
                              }`}
                              style={{ width: `${(resource.rating / 5) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution Chart */}
            <Card className="shadow-xl border-4 border-blue-400 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <CardTitle className="flex items-center gap-2 text-white text-xl font-bold">
                  <FileText className="w-5 h-5" />
                  📊 Category Distribution (Mine vs Total)
                </CardTitle>
                <CardDescription className="text-blue-100 font-semibold">
                  See how your uploads compare across categories
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {getCategoryDistribution().map((cat, idx) => (
                    <div key={cat.category} className="animate-slide-in-left" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900 capitalize">
                          {cat.category.replace("-", " ")}
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {cat.mine} / {cat.total} ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 ${
                            idx % 5 === 0
                              ? "bg-gradient-to-r from-red-400 to-red-600"
                              : idx % 5 === 1
                              ? "bg-gradient-to-r from-orange-400 to-orange-600"
                              : idx % 5 === 2
                              ? "bg-gradient-to-r from-purple-400 to-purple-600"
                              : idx % 5 === 3
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : "bg-gradient-to-r from-blue-400 to-blue-600"
                          }`}
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-4 border-red-400 shadow-xl sticky top-8 rounded-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-yellow-400 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-white text-xl font-bold">
                  <Upload className="w-5 h-5" />
                  Upload PDF Resource
                </CardTitle>
                <CardDescription className="text-gray-100 font-semibold">Add PDF files to the library</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Resource Title</label>
                  <Input
                    placeholder="e.g., Physics 101"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-2 border-yellow-400 focus:border-red-500 font-semibold text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                  <textarea
                    placeholder="Brief description of the resource"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 text-sm font-semibold focus:border-red-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2 text-gray-900 text-sm font-semibold focus:border-red-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace("-", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Select PDF File</label>
                  <div className="relative">
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="pdf-upload" />
                    <label
                      htmlFor="pdf-upload"
                      className="flex items-center justify-center w-full border-2 border-dashed border-yellow-400 rounded-lg p-4 cursor-pointer hover:bg-yellow-50 transition"
                    >
                      <div className="text-center">
                        <File className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-900">Click to select PDF</p>
                        <p className="text-xs text-gray-600 font-semibold">Max 1GB</p>
                      </div>
                    </label>
                  </div>
                  {fileData && (
                    <div className="mt-3 p-3 bg-green-100 border-2 border-green-400 rounded-lg">
                      <p className="text-sm font-bold text-green-900">Selected: {fileData.name}</p>
                      <p className="text-xs text-green-800 font-semibold">Size: {fileData.size} MB</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-bold text-base h-12 shadow-lg transform hover:scale-105 transition"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resources List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6 p-6 bg-white rounded-xl border-4 border-yellow-400 shadow-lg">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Resources Library</h2>
                <p className="text-red-600 text-sm mt-1 font-bold">Total resources: {resources.length}</p>
              </div>
            </div>

            {resources.length === 0 ? (
              <Card className="border-4 border-dashed border-yellow-400 bg-yellow-50 rounded-xl">
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <p className="text-gray-900 font-bold text-lg">No resources uploaded yet.</p>
                  <p className="text-gray-700 text-sm font-semibold">Start by uploading your first resource.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {resources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="border-2 border-red-400 hover:border-red-600 hover:shadow-xl transition rounded-xl"
                  >
                    <CardContent className="p-5 bg-white hover:bg-red-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-gradient-to-r from-yellow-400 to-red-500 p-3 rounded-lg shadow-lg">
                              <File className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{resource.title}</h3>
                              <p className="text-xs text-gray-600 mt-1 font-semibold">📄 {resource.fileName}</p>
                              <p className="text-xs text-gray-600 font-semibold">Size: {resource.fileSize} MB</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 font-semibold mb-3">{resource.description}</p>
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full">
                              {resource.category.replace("-", " ").toUpperCase()}
                            </span>
                            <span className="text-green-600">Uploaded: {resource.uploadedDate}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDelete(resource.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold ml-2 shadow-lg transform hover:scale-110 transition"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
