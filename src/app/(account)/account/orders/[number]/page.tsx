import AccountOrderDetailsPage from "@/features/account/order-details/page";
export default async function Page({params}:{params:Promise<{number:string}>}){const {number}=await params;return <AccountOrderDetailsPage number={decodeURIComponent(number)}/>}
