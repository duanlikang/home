package com.outstudio.plan.util;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class DecreaseDaysJob implements Job {
	public void execute(JobExecutionContext context) throws JobExecutionException {
		// UserService.me.reduceDays();
	}
}