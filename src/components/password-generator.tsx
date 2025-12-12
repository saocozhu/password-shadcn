"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState("")

  // 计算密码强度
  const passwordStrength = useMemo(() => {
    if (!password || password === "请至少选择一种字符类型") return { level: 0, label: "", color: "" }

    let strength = 0
    if (length >= 12) strength++
    if (length >= 16) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    if (length >= 20) strength++

    if (strength <= 2) return { level: 1, label: "弱", color: "text-red-500" }
    if (strength <= 4) return { level: 2, label: "中等", color: "text-yellow-500" }
    if (strength <= 5) return { level: 3, label: "强", color: "text-blue-500" }
    return { level: 4, label: "非常强", color: "text-green-500" }
  }, [password, length])

  const generatePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let charset = ""
    if (includeUppercase) charset += uppercase
    if (includeLowercase) charset += lowercase
    if (includeNumbers) charset += numbers
    if (includeSymbols) charset += symbols

    if (charset.length === 0) {
      setPassword("请至少选择一种字符类型")
      toast.error("请至少选择一种字符类型")
      return
    }

    let generatedPassword = ""
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      generatedPassword += charset[array[i] % charset.length]
    }

    setPassword(generatedPassword)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const copyToClipboard = async () => {
    if (password && password !== "请至少选择一种字符类型") {
      try {
        await navigator.clipboard.writeText(password)
        toast.success("密码已复制到剪贴板", {
          icon: <CheckCircle2 className="h-4 w-4" />,
        })
      } catch (err) {
        toast.error("复制失败，请重试")
      }
    }
  }

  // 当设置改变时自动重新生成密码
  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>密码生成器</CardTitle>
        <CardDescription>
          生成安全、随机的密码
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 密码显示区域 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">生成的密码</Label>
            {passwordStrength.label && (
              <span className={`text-sm font-medium ${passwordStrength.color}`}>
                强度: {passwordStrength.label}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              id="password"
              value={password}
              readOnly
              className="font-mono text-lg"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={!password || password === "请至少选择一种字符类型"}
                title="复制密码"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={generatePassword}
                title="刷新密码"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* 密码强度条 */}
          {passwordStrength.level > 0 && (
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength.level === 1
                    ? "bg-red-500 w-1/4"
                    : passwordStrength.level === 2
                    ? "bg-yellow-500 w-1/2"
                    : passwordStrength.level === 3
                    ? "bg-blue-500 w-3/4"
                    : "bg-green-500 w-full"
                }`}
              />
            </div>
          )}
        </div>

        {/* 密码长度滑块 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="length">密码长度</Label>
            <span className="text-sm text-muted-foreground">{length}</span>
          </div>
          <Slider
            id="length"
            min={4}
            max={64}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>

        {/* 字符类型选项 */}
        <div className="space-y-3">
          <Label>包含字符类型</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
              />
              <Label
                htmlFor="uppercase"
                className="text-sm font-normal cursor-pointer"
              >
                大写字母 (A-Z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
              />
              <Label
                htmlFor="lowercase"
                className="text-sm font-normal cursor-pointer"
              >
                小写字母 (a-z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
              />
              <Label
                htmlFor="numbers"
                className="text-sm font-normal cursor-pointer"
              >
                数字 (0-9)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
              />
              <Label
                htmlFor="symbols"
                className="text-sm font-normal cursor-pointer"
              >
                特殊字符 (!@#$...)
              </Label>
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <Button
          onClick={generatePassword}
          className="w-full"
          size="lg"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          生成新密码
        </Button>
      </CardContent>
    </Card>
  )
}

