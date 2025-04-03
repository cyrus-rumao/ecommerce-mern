import User from "../Models/UserModel.js";
import Product from "../Models/productModel.js";
import Order from "../Models/orderModel.js";
export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const startdate = new Date();
    const endDate = new Date(startdate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dailySales = await getDailySalesData(startdate, endDate);

    res.json({ analyticsData, dailySales });
  } catch (error) {
    console.log("Error in Analytics Route", error);
    res.status(500).json({ message: "Analytics Route Error" });
  }
};

const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments({});
  const totalProducts = await Product.countDocuments({});

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, //groups all documents together
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
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate, //greater than start date
            $lte: endDate, //lesser than end date
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

    const dateArray = getDateArray(startDate, endDate);
    console.log(dateArray);

    return dateArray.map((date) => {
      const foundData = dailySales.find((item) => item._id == date);
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
  return dateArray;
}
