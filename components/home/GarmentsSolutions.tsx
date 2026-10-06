'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Factory, FileText, Package, Scissors, Shirt, Users } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

const MODULES = [
  {
    icon: Shirt,
    title: 'Merchandising & Order Tracking',
    desc: 'Buyer, style and PO management with TNA timelines, so every order milestone is visible.',
  },
  {
    icon: Scissors,
    title: 'Production & Line Output',
    desc: 'Cutting → Sewing → Finishing tracking, line-wise daily targets and efficiency.',
  },
  {
    icon: Package,
    title: 'Store & Inventory',
    desc: 'Fabric and trims receive / issue, stock balance and low-stock alerts.',
  },
  {
    icon: FileText,
    title: 'Commercial & Export Docs',
    desc: 'PI, LC, commercial invoice and packing list generated from order data.',
  },
  {
    icon: Users,
    title: 'HR, Attendance & Payroll',
    desc: 'Worker attendance, piece-rate and overtime calculation, salary sheets.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Dashboards',
    desc: 'Management dashboards with Excel / PDF export, replacing scattered spreadsheets.',
  },
]

export default function GarmentsSolutions() {
  return (
    <section id="garments" className="bg-[#f5f8f7] py-20 lg:py-24">
      <div className="container-custom">
        <Reveal variant="rise" className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="section-kicker">Industry Focus</p>
            <h2 className="section-heading">Garments &amp; Apparel Software Solutions</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              I understand how a garments factory actually runs — from buyer order to shipment. I build
              ERP modules that replace Excel sheets and manual follow-ups with one connected system.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="btn-secondary w-fit">
              See Garments Projects <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {MODULES.map(({ icon: Icon, title, desc }) => (
            <StaggerItem
              key={title}
              as="div"
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-[0_18px_44px_rgba(15,23,42,0.10)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal variant="scale" className="mt-10 flex flex-col items-start gap-4 rounded-[1.75rem] bg-slate-950 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black">Running a factory or buying house?</p>
              <p className="mt-1 text-sm text-slate-300">Tell me your workflow — I&apos;ll suggest which modules you need first.</p>
            </div>
          </div>
          <Link href="/contact" className="btn-primary w-fit flex-shrink-0">
            <span className="relative z-10 inline-flex items-center">
              Discuss Your Requirements <ArrowRight className="ml-1.5 h-4 w-4" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
