import { db } from "@/lib/prisma"; // importando o banco de dados

interface RestaurantPageProps {
    params: Promise<{slug: string}>
}
const RestaurantPage = async ({ params }: RestaurantPageProps) => {
    const { slug } = await params;
    const restaurant = await db.restaurant.findUnique({where: {slug}})
    return <h1>{restaurant?.name}</h1>;
};

export default RestaurantPage;
