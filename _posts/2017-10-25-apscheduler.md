---
layout:     post
title:      apscheduler 调度框架指南
category:   技术
header-img: 
---
# apscheduler 使用记录

* [apscheduler 官方指南](http://apscheduler.readthedocs.io/en/latest/userguide.html)

* [apscheduler github地址](https://github.com/agronholm/apscheduler)

工作中需要使用任务调度，通过网络查找后发现apscheduler最适合要求，且简单好用。经常查看搜索官方指南，现整理比较常用的功能点。

APScheduler有四种组件：

* 触发器 triggers  
    1. [date](http://apscheduler.readthedocs.io/en/latest/modules/triggers/date.html#module-apscheduler.triggers.date)  固定时间执行一次，执行后自动删除任务
    2. [interval](http://apscheduler.readthedocs.io/en/latest/modules/triggers/interval.html#module-apscheduler.triggers.interval)  循环执行任务，任务一直存在
    3. [cron](http://apscheduler.readthedocs.io/en/latest/modules/triggers/cron.html#module-apscheduler.triggers.cron)      cron指定格式执行，任务一直存在
* 任务持久化 job stores
    1. MongoDBJobStore
    2. SQLAlchemyJobStore
    3. MemoryJobStore [非持久化]
    4. RedisJobStore
    5. ZooKeeperJobStore
    6. RethinkDBJobStore
* 任务执行方法 executors  
    注意：如果job stores需要持久化保存，你的执行方法参数需要满足
    1. 目标可访问必须全局可访问
    2. Any arguments to the callable must be serializable [参数必须可序列化]
* 调度 schedulers
    1. [BlockingScheduler](http://apscheduler.readthedocs.io/en/latest/modules/schedulers/blocking.html#apscheduler.schedulers.blocking.BlockingScheduler) 阻塞调度 [demo](https://github.com/agronholm/apscheduler/blob/master/examples/schedulers/blocking.py)
    2. [BackgroundScheduler](http://apscheduler.readthedocs.io/en/latest/modules/schedulers/background.html#apscheduler.schedulers.background.BackgroundScheduler) 非阻塞调度 [demo](https://github.com/agronholm/apscheduler/blob/master/examples/schedulers/background.py)
    3. [AsyncIOScheduler](http://apscheduler.readthedocs.io/en/latest/modules/schedulers/asyncio.html#apscheduler.schedulers.asyncio.AsyncIOScheduler)  未使用 [demo](https://github.com/agronholm/apscheduler/blob/master/examples/schedulers/asyncio_.py)
    4. [GeventScheduler](http://apscheduler.readthedocs.io/en/latest/modules/schedulers/gevent.html#apscheduler.schedulers.gevent.GeventScheduler) 未接触 [demo](https://github.com/agronholm/apscheduler/blob/master/examples/schedulers/gevent_.py)
    5. [TwistedScheduler](http://apscheduler.readthedocs.io/en/latest/modules/schedulers/twisted.html#apscheduler.schedulers.twisted.TwistedScheduler) 未使用 [demo](https://github.com/agronholm/apscheduler/blob/master/examples/schedulers/twisted_.py)





