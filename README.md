# ScoreBro

ScoreBro is a story-point-driven engine for bug tracking/bashing and task management, gamified to drive developer success. It is ideal for multi-person dev teams, where a tech lead/project manager is able to quantify units of work for necessary tasks, dividing them into sprints.

Here is a quick outline of how ScoreBro works:

* Tech Lead collects list of tasks which need assignment in their Bucket
* Sprints are defined according to start date, title, and duration
* Tasks are assigned to Sprints
* When assigned, tasks are given an allotment of points that represent the value, priority, and/or expected difficulty of the task
* When Sprint begins, tasks are available to the dev team
* Team is encouraged to cherry-pick tasks, based on point totals
* Point totals decay over time ( function of current points - (total points / length of sprint in days) )
* When tasks are marked complete, eligible points are assessed by tech lead
* If approved, dev is awarded the eligible points at the time task is submitted
* Leaderboard tracks team progress over sprint

## Benefits

Developers are encouraged to deliver clean, testable, code which satisfies the task described. Over time, tech leads will get a sense of the threshold each developer has of total 'points' they can accomplish in a given time period. 

Highlights disparity in output amongst team members

## Credits
Developed by Don Burks (don@lighthouselabs.ca) using inspiration from the tutorial series on Node Authentication from [scotch.io](http://scotch.io)
