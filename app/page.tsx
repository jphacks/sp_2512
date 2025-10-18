import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Car, Merge, MapPin, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-16 pt-12 relative">
          <div
            className="absolute inset-0 -inset-x-32 -inset-y-16 opacity-95 dark:opacity-70 rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-10-18%2016.10.50-90uDnKP7vIx4obwIJKM5BEpWNtLx9D.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(2px) brightness(1.1)",
            }}
          />
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="relative inline-block">
            <h1 className="relative text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
              安全マップ
            </h1>
          </div>
          <div className="relative inline-block px-6 py-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg">
            <p className="text-foreground text-xl text-balance font-semibold drop-shadow-md">
              旅行者のための安全情報共有プラットフォーム
            </p>
          </div>
        </header>

        <div className="grid gap-6 mb-12 md:grid-cols-1">
          <Link href="/safety" className="block group">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:shadow-red-500/50 transition-shadow">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl text-red-900 dark:text-red-100 mb-1">治安・事件情報</CardTitle>
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">危険エリアを確認</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base text-red-800 dark:text-red-200">
                  治安が悪い場所や事件が多い場所を地図上で確認できます
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-red-700 dark:text-red-300">
                  ユーザーから報告された危険エリアをリアルタイムで確認し、安全な旅行をサポート
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/accident" className="block group">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl text-orange-900 dark:text-orange-100 mb-1">交通事故情報</CardTitle>
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">事故多発地点を確認</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base text-orange-800 dark:text-orange-200">
                  交通事故が多い場所や交通マナーが悪い場所を確認できます
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  事故多発エリアや危険な交差点を事前にチェックして、安全運転をサポート
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/complex-intersection" className="block group">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-amber-500/50 transition-shadow">
                    <Merge className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl text-amber-900 dark:text-amber-100 mb-1">複雑な交差点情報</CardTitle>
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">複雑な地点を確認</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base text-amber-800 dark:text-amber-200">
                  車線が多く複雑な交差点や交通ルールが複雑な地点を確認できます
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  初めて通る方が迷いやすい複雑な交差点を事前に把握して、スムーズな移動をサポート
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="bg-gradient-to-br from-muted/80 to-muted/40 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              使い方
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex-shrink-0 mt-0.5">
                1
              </div>
              <p>確認したいカテゴリを選択してください</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex-shrink-0 mt-0.5">
                2
              </div>
              <p>地図上で危険エリアや注意が必要な場所を確認できます</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex-shrink-0 mt-0.5">
                3
              </div>
              <p>新しい情報を投稿して、他のユーザーと共有することもできます</p>
            </div>
            <p className="text-muted-foreground pt-3 text-xs border-t border-border/50">
              ※ データはブラウザに保存されます
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
