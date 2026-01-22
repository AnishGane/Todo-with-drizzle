import { Search } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useQueryState } from 'nuqs'

export default function SearchTodo() {
    const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  return (
    <CardContent>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search your todos"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </CardContent>
  )
}
