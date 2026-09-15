import { redirect } from "next/navigation"

type SearchParams = { searchParams: Promise<{ model?: string }> }

export default async function SettingRedirect({ searchParams }: SearchParams) {
    const { model } = await searchParams

    if (model) redirect(`/build-your-model/setting/${model}`)

    redirect("/build-your-model")
}