import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Car } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold mb-3 text-balance">安全マップ</h1>
          <p className="text-muted-foreground text-lg text-balance">旅行者のための安全情報共有プラットフォーム</p>
        </header>

        <div className="grid gap-6 mb-8">
          <Link href="/safety" className="block transition-transform hover:scale-[1.02]">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-red-100 dark:bg-red-950 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-2xl">治安・事件情報</CardTitle>
                </div>
                <CardDescription className="text-base">治安が悪い場所や事件が多い場所を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">ユーザーから報告された危険エリアを地図上で確認</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/accident" className="block transition-transform hover:scale-[1.02]">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-orange-100 dark:bg-orange-950 rounded-lg">
                    <Car className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-2xl">交通事故情報</CardTitle>
                </div>
                <CardDescription className="text-base">
                  交通事故が多い場所や交通マナーが悪い場所を確認できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">事故多発エリアや危険な交差点を地図上で確認</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">使い方</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. 確認したいカテゴリを選択してください</p>
            <p>2. 地図上で危険エリアを確認できます</p>
            <p>3. 新しい情報を投稿することもできます</p>
            <p className="text-muted-foreground pt-2">※ データはブラウザに保存されます</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
