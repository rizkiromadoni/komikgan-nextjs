"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

type Props = {
    children: React.ReactNode
    title?: string
    description?: string
}

const AdminCard: React.FC<Props> = ({ children, title, description }) => {
  return (
    <Card className={(!title && !description) ? "pt-6" : ""}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

export default AdminCard