import User from "../Models/UserModel.js";
import Product from "../Models/productModel.js";
import Order from "../Models/orderModel.js";
export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    startDate.setUTCHours(0, 0, 0, 0);
    // console.log("Start Date:", startDate.toISOString());
    // console.log("End Date:", endDate.toISOString());

    const dailySales = await getDailySalesData(startDate, endDate);

    return res.json({ analyticsData, dailySales });
  } catch (error) {
    console.log("Error in Analytics Route", error);
    return res.status(500).json({ message: "Analytics Route Error" });
  }
};

const getAnalyticsData = async () => {
  const totalUsersWithOrders = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user",
        as: "orders",
      },
    },
    {
      $match: {
        "orders.0": { $exists: true },
      },
    },
    {
      $count: "count",
    },
  ]);

  const totalUsers = totalUsersWithOrders[0]?.count || 0;

  const totalProducts = await Product.countDocuments({});

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    totalUsers: totalUsers,
    totalProducts: totalProducts,
    totalSales: totalSales,
    totalRevenue: totalRevenue,
  };
};
export const getDailySalesData = async (startDate, endDate) => {
  try {
    // console.log(
    //   "Matching Orders From",
    //   startDate.toISOString(),
    //   "To",
    //   endDate.toISOString()
    // );

    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // console.log(dailySales);
    const dateArray = getDateArray(startDate, endDate);
    // console.log(dateArray);

    return dateArray.map((date) => {
      const foundData = dailySales.find((item) => item._id === date);
      return {
        date,
        sales: foundData ? foundData.totalSales : 0,
        revenue: foundData ? foundData.totalRevenue : 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDateArray(startDate, endDate) {
  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateArray.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // console.log(dateArray);
  return dateArray;
}
