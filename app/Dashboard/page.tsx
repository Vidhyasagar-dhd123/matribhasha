"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Image from "next/image"

export default function DashboardPage() {
  const user = {
    name: "Aarohi Sharma",
    profilePic: "/profile.jpeg",
    upvotes: 98,
    languages: ["Hindi", "English", "Marathi", "Sanskrit"],
    stats: {
      translationsFrequency: [
        { month: "Jan", count: 5 },
        { month: "Feb", count: 8 },
        { month: "Mar", count: 3 },
        { month: "Apr", count: 10 },
        { month: "May", count: 6 }
      ],
      booksTranslated: 14,
      avgPagesPerBook: 120,
      booksAuthored: 3,
      translationsByLang: [
        { lang: "Hindi", count: 8 },
        { lang: "English", count: 5 },
        { lang: "Marathi", count: 7 },
        { lang: "Sanskrit", count: 2 }
      ]
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-pink-50 to-purple-50 p-6 space-y-8 dark:from-gray-800 dark:to-gray-900">
      
      {/* User Card */}
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <Image
            src={user.profilePic}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border-4 border-pink-200 shadow-md object-cover"
          />
          <CardTitle className="mt-4 text-xl">{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">Total Upvotes: {user.upvotes}</p>
           <div>
           <span className="text-gray-600">Languages Known:</span>
           <div className="flex flex-wrap gap-2 mt-2">
             {user.languages.map((lang, idx) => (
               <span
                 key={idx}
                 className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium shadow-sm"
               >
                 {lang}
               </span>
             ))}
           </div>
         </div>
        </CardContent> 
      </Card>

      {/* Dashboard Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        
        {/* 📈 Translation Frequency Chart */}
        <Card className="col-span-1 md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>📈 Frequency of Translation</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={user.stats.translationsFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 📚 Number of Books Translated */}
        <Card>
          <CardHeader><CardTitle>📚 Books Translated</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-600">{user.stats.booksTranslated}</p>
          </CardContent>
        </Card>

        {/* 📄 Avg Pages per Book */}
        <Card>
          <CardHeader><CardTitle>📄 Avg Pages per Book</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{user.stats.avgPagesPerBook}</p>
          </CardContent>
        </Card>

        {/* ✍️ Books Authored */}
        <Card>
          <CardHeader><CardTitle>✍️ Books Authored</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">{user.stats.booksAuthored}</p>
          </CardContent>
        </Card>

        {/* 🌍 Translations per Language */}
        <Card>
          <CardHeader><CardTitle>🌍 Translations per Language</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {user.stats.translationsByLang.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-gray-700">{item.lang}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
