// Writes the App Clip's QR code as a crisp SVG, with Core Image, so nothing
// needs installing. The link is APP_CLIP in build.mjs.
//
//   swift tools/app-clip-qr.swift > assets/app-clip-qr.svg
import CoreImage
import Foundation

let link = "https://appclip.apple.com/id?p=com.tintronix.pixelflow.Clip"
let ink = "#2b2338"

let filter = CIFilter(name: "CIQRCodeGenerator")!
filter.setValue(link.data(using: .utf8), forKey: "inputMessage")
filter.setValue("Q", forKey: "inputCorrectionLevel")
let image = filter.outputImage!
let w = Int(image.extent.width), h = Int(image.extent.height)
var pixels = [UInt8](repeating: 0, count: w * h * 4)
CIContext().render(
  image, toBitmap: &pixels, rowBytes: w * 4, bounds: image.extent, format: .RGBA8,
  colorSpace: CGColorSpaceCreateDeviceRGB())

// Core Image leaves a one-module margin; the code needs a quiet zone of four.
let quiet = 4
let n = w - 2
let size = n + quiet * 2
var path = ""
for y in 0..<n {
  var x = 0
  while x < n {
    let dark = { (x: Int) in pixels[((y + 1) * w + x + 1) * 4] < 128 }
    guard dark(x) else { x += 1; continue }
    var run = 1
    while x + run < n && dark(x + run) { run += 1 }
    path += "M\(x + quiet) \(y + quiet)h\(run)v1h-\(run)z"
    x += run
  }
}
print(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 \(size) \(size)\" shape-rendering=\"crispEdges\">"
    + "<rect width=\"\(size)\" height=\"\(size)\" fill=\"#fff\"/><path fill=\"\(ink)\" d=\"\(path)\"/></svg>")
