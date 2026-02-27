import { completeProfileAction } from "@/actions/profile-actions";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: { next?: string };
};

export default async function CompleteProfilePage({ searchParams }: PageProps) {
  const user = await requireUser();
  if (user.profileCompleted) {
    redirect(searchParams?.next || "/");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-10">
      <section className="card w-full p-8">
        <h1 className="text-3xl font-black text-ink">Complete Your Profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          You need profile details before registering for events.
        </p>

        <form action={completeProfileAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={searchParams?.next || "/"} />
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Signed in as <span className="font-semibold">{user.email}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              required
              name="gender"
              defaultValue={user.gender || ""}
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              required
              name="age"
              type="number"
              min={10}
              max={100}
              defaultValue={user.age || ""}
              placeholder="Age"
              className="rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>
          <input
            required
            name="phone"
            defaultValue={user.phone || ""}
            placeholder="Phone Number"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />

          <button className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white">Save Profile</button>
        </form>
      </section>
    </main>
  );
}
