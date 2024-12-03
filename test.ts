export const getUserWorkHourDayAndMonth = async (userId: string) => {
    try {
        // Start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        

        // Start of this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0); 


        // Start of tomorrow date
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
       

        // Current date and time
        const currentDate = new Date();

    
        // Query the database for today records for the given userId
        const todayRecords = await timeTrack.find({
            userId,
            start_time: { $gte: startOfToday, $lt: startOfTomorrow },
        });
         // Query the database for the current month records for the given userId
         const monthlyRecords = await timeTrack.find({
            userId,
            start_time: { $gte: startOfMonth, $lt: currentDate },
        });
        

        // Function to convert 'HH:MM:SS' string to seconds
        const timeToSeconds = (time: string) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        };

        // Calculate total time for today in seconds
        let totalTimeInSecondsToday = 0;
        todayRecords.forEach(record => {
            if (record.total_time) {
                totalTimeInSecondsToday += timeToSeconds(record.total_time);
            }
        });

        // Calculate total time for the current month in seconds
        let totalTimeInSecondsMonth = 0;
        monthlyRecords.forEach(record => {
            if (record.total_time) {
                totalTimeInSecondsMonth += timeToSeconds(record.total_time);
            }
        });


        // Convert total time for today to hours, minutes, seconds
        const hoursToday = Math.floor(totalTimeInSecondsToday / 3600);
        const minutesToday = Math.floor((totalTimeInSecondsToday % 3600) / 60);
        const secondsToday = totalTimeInSecondsToday % 60;


         // Convert total time for the current month to hours, minutes, seconds
         const hoursMonth = Math.floor(totalTimeInSecondsMonth / 3600);
         const minutesMonth = Math.floor((totalTimeInSecondsMonth % 3600) / 60);
         const secondsMonth = totalTimeInSecondsMonth % 60;

         // Calculate the number of distinct days the user worked in the current month
        const distinctWorkDays = new Set<string>();


        monthlyRecords.forEach(record => {
            if (record.start_time) {
                const dateString = new Date(record.start_time).toISOString().split('T')[0]; // YYYY-MM-DD
                distinctWorkDays.add(dateString);
            }
        });
        const TotalMonthWorkingDay = distinctWorkDays.size;
        const todytitle = "Today works Hour";
        const monthworkingtitle="This month working day";
        const monthworkingHourstitle = "This month working hours"; 

        return {todytitle,monthworkingtitle,monthworkingHourstitle,hoursToday,minutesToday,secondsToday,hoursMonth,minutesMonth,secondsMonth,TotalMonthWorkingDay};
    } catch (error) {
        console.error("Error fetching today's time tracking data:", error);
        throw error;
    }
};