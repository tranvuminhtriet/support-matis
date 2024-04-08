import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import CssFilterConverter from "css-filter-converter"
import { Chart, registerables } from "chart.js"
import { animate, state, style, transition, trigger } from "@angular/animations"

@Component({
  selector: "app-image-with-layer",
  templateUrl: "./image-with-layer.component.html",
  styleUrl: "./image-with-layer.component.scss",
  animations: [
    trigger("sizeAnimation", [
      state(
        "small",
        style({
          width: "100px",
          height: "100px",
        })
      ),
      state(
        "big",
        style({
          width: "200px",
          height: "200px",
        })
      ),
      transition("small <=> big", animate("200ms ease-in-out")),
    ]),
  ],
})
export class ImageWithLayerComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement> //
  @ViewChild("canvas2") canvas2Ref!: ElementRef<HTMLCanvasElement>
  @ViewChild("chart") chartRef!: ElementRef<HTMLCanvasElement>
  isBigChart: boolean = true

  layers: {
    colorName?: string
    opacity: number
    image: HTMLImageElement
    filterColor?: string
  }[] = []

  chartPosition = { x: 0, y: 0 }
  firstPointPosition = { x: 0, y: 0 }
  chartVisibility = "hidden"
  hadChartPosition = false

  inputData = [
    { colorName: "i1", colorHex: "#a90c22", src: "/assets/i1.jpg" },
    { colorName: "i2", colorHex: "#fa99ff", src: "/assets/i2.jpg" },
    { colorName: "i3", colorHex: "#c86477", src: "/assets/i3.jpg" },
    { colorName: "i4", colorHex: "#3333ff", src: "/assets/i4.jpg" },
    { colorName: "i5", colorHex: "#6464ff", src: "/assets/i5.jpg" },
    { colorName: "i6", colorHex: "#fa9934", src: "/assets/i6.jpg" },
    { colorName: "i7", colorHex: "#073300", src: "/assets/i7.jpg" },
    { colorName: "i8", colorHex: "#36cc00", src: "/assets/i8.jpg" },
    { colorName: "i9", colorHex: "#280128", src: "/assets/i9.jpg" },
    { colorName: "i10", colorHex: "#cccc01", src: "/assets/i10.jpg" },
    { colorName: "i11", colorHex: "#0113cc", src: "/assets/i11.jpg" },
    { colorName: "i12", colorHex: "#f80e7f", src: "/assets/i12.jpg" },
    { colorName: "i13", colorHex: "#990200", src: "/assets/i13.jpg" },
    { colorName: "i14", colorHex: "#000566", src: "/assets/i14.jpg" },
    { colorName: "i15", colorHex: "#282828", src: "/assets/i15.jpg" },
    { colorName: "test", colorHex: "#fffff", src: "/assets/test.png" },
  ]

  constructor() {
    Chart.register(...registerables)
  }

  ngAfterViewInit(): void {
    this.generateCanvasSize()

    this.generateChart()
  }

  generateChart() {
    const canvas = this.chartRef.nativeElement
    const context = canvas.getContext("2d")

    if (context) {
      const plugin = {
        id: "customCanvasBackgroundColor",
        beforeDraw: (chart: any, args: any, options: any) => {
          const { ctx } = chart
          ctx.save()
          ctx.globalCompositeOperation = "destination-over"
          ctx.fillStyle = options.color || "rgba(224, 219, 221, 0.65)"
          ctx.fillRect(0, 0, chart.width, chart.height)
          ctx.restore()
        },
      }

      const data = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
        datasets: [
          {
            data: [11, 16, 7, 3, 14],
            backgroundColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderColor: ["black"],
            borderWidth: 1,
          },
        ],
      }
      new Chart(context, {
        type: "polarArea",
        data,
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
        plugins: [plugin],
      })
    }
  }

  onColorChange($event: any, colorName?: string) {
    console.log($event.target.value)
    const index = this.layers.findIndex((layer) => layer.colorName === colorName)
    const filter = this.generateFilter($event.target.value)
    this.layers[index].filterColor = filter.color ?? undefined
    this.drawAllLayers()
  }

  generateCanvasSize() {
    const canvas = this.canvasRef.nativeElement
    const canvas2 = this.canvas2Ref.nativeElement

    const image = new Image()
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height

      canvas2.width = image.width
      canvas2.height = image.height
    }
    image.src = this.inputData[0].src
    // this.generateFirstLayer("/assets/init.jpg")
  }

  generateFirstLayer(src?: string) {
    if (src) {
      const image = new Image()
      const canvas = this.canvasRef.nativeElement
      const context = canvas.getContext("2d")
      image.onload = () => {
        context?.drawImage(image, 0, 0)
      }
      image.src = src
      this.layers.push({ image: image, opacity: 1 })
    }
  }

  drawLayer(i: number) {
    const newImg = new Image()
    newImg.src = this.inputData[i].src
    newImg.onload = () => {
      this.layers.push({
        colorName: this.inputData[i].colorName,
        image: newImg,
        opacity: 1,
      })
      this.drawAllLayers()
    }
  }

  layerExists(colorName?: string) {
    return this.layers.some((layer) => layer.colorName === colorName)
  }

  removeLayer(colorName?: string) {
    const index = this.layers.findIndex((layer) => layer.colorName === colorName)
    if (index !== -1) {
      this.layers.splice(index, 1)
      this.drawAllLayers()
    }
  }

  getOpacity(colorName?: string): number {
    const layer = this.layers.find((layer) => layer.colorName === colorName)
    return layer ? layer.opacity : 1 // default opacity is 1
  }

  updateOpacity(event: any, colorName?: string): void {
    const layerIndex = this.layers.findIndex((layer) => layer.colorName === colorName)
    if (layerIndex !== -1 && !!event) {
      this.layers[layerIndex].opacity = parseFloat(event.target.value)
      this.drawAllLayers()
    }
  }

  drawAllLayers() {
    const canvas = this.canvasRef.nativeElement
    const context = canvas.getContext("2d")
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      for (const layer of this.layers) {
        context.globalAlpha = layer.opacity // Set opacity for each layer

        // Adjust color
        if (layer.filterColor) {
          context.filter = layer.filterColor
        } else {
          context.filter = "none"
        }

        context.drawImage(layer.image, 0, 0)
      }
    }
  }

  generateFilter(hexColor: string) {
    return CssFilterConverter.hexToFilter(hexColor)
  }

  getMousePositionToShowChart(event: MouseEvent) {
    if (this.hadChartPosition) return

    const canvas = this.canvasRef.nativeElement
    const rect = canvas.getBoundingClientRect()

    const chart = this.chartRef.nativeElement
    const chartRect = chart.getBoundingClientRect()

    // Toạ độ để hiển thị chart
    const xChart = event.clientX - rect.left - chartRect.width / 2
    const yChart = event.clientY - rect.top - chartRect.height / 2

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    this.chartPosition = { x: xChart, y: yChart }
    this.firstPointPosition = { x, y }
    this.chartVisibility = "visible"
    this.hadChartPosition = true
  }

  onChartMoving(event: any) {
    const chart = this.chartRef.nativeElement
    const chartRect = chart.getBoundingClientRect()

    const canvas2 = this.canvas2Ref.nativeElement
    const context = canvas2.getContext("2d")
    const rect2 = canvas2.getBoundingClientRect()

    if (!context) return

    // (canvas2.width / rect2.width) và (canvas2.height / rect2.height) là tỉ lệ tương ứng để hiển thị vị trí toạ độ trên canvas
    // so với toạ độ lấy trên width/height của element
    const xFirstPoint = this.firstPointPosition.x * (canvas2.width / rect2.width)
    const yFirstPoint = this.firstPointPosition.y * (canvas2.height / rect2.height)

    const x = (event.x + chartRect.width / 2) * (canvas2.width / rect2.width)
    const y = (event.y + chartRect.height / 2) * (canvas2.height / rect2.height)

    // Xoá các đường cũ trước khi vẽ
    context.clearRect(0, 0, canvas2.width, canvas2.height)
    // line width
    context.lineWidth = 10

    context.beginPath()
    // Vẽ firstPoint
    context.arc(xFirstPoint, yFirstPoint, 20, 0, Math.PI * 2)
    context.fillStyle = "black"
    context.fill()

    // Vẽ đường nối
    context.moveTo(xFirstPoint, yFirstPoint)
    context.lineTo(x, y)
    context.stroke()
  }

  onMoveEnd(event: any) {}

  toggleSize() {
    this.isBigChart = !this.isBigChart
  }
}
