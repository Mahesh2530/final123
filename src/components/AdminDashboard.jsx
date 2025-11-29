"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Upload, LogOut, Trash2, BookOpen, FileText, File } from "lucide-react"
import { addResource, getResources, deleteResource, initializeDB } from "../utils/indexeddb"

export function AdminDashboard({ userName, onLogout }) {
  const [resources, setResources] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("textbooks")
  const [fileName, setFileName] = useState("")
  const [fileData, setFileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResources = async () => {
      try {
        await initializeDB()
        const savedResources = await getResources()
        setResources(savedResources)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Error loading resources:", error)
        setLoading(false)
      }
    }
    loadResources()
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file")
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB")
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
      <header className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 border-b-4 border-yellow-400 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-3 rounded-lg shadow-lg">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edulibrary Admin</h1>
              <p className="text-sm text-yellow-100 font-semibold">Welcome, {userName}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            className="bg-yellow-400 text-red-600 hover:bg-yellow-500 font-bold flex items-center gap-2 shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                    className="border-2 border-yellow-400 focus:border-red-500 font-semibold"
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
                        <p className="text-xs text-gray-600 font-semibold">Max 50MB</p>
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
