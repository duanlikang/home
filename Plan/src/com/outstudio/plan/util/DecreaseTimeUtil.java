package com.outstudio.plan.util;

import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

public class DecreaseTimeUtil {
	public static void decrease() {
		try {
			Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();
			JobDetail job = JobBuilder.newJob(DecreaseDaysJob.class).withIdentity("job1", "group1").build();
			Trigger trigger = TriggerBuilder.newTrigger().withIdentity("trigger1", "group1").startNow()
					.withSchedule(CronScheduleBuilder.cronSchedule("0 0 0 * * ?")).build();
			scheduler.scheduleJob(job, trigger);
			scheduler.start();
		} catch (SchedulerException se) {
			se.printStackTrace();
		}
	}
}
