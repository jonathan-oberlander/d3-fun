import {select, transition, easeElasticInOut, randomNormal, randomInt} from 'd3'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const width = app.clientWidth
const height = app.clientHeight

const svg = select(app)
  .selectAll('svg') // empty at first
  .data([null]) // length of array
  .join('svg') // shorthand

svg  
  .attr('width', width)
  .attr('height', height)
  // .style('background', 'gray')

const data = [
  {id: 1, x: 120, y: 120, r: 48, fill: '#ff40FF'},
  {id: 2, x: 180, y: 50, r: 15, fill: '#0f20FF'},
  {id: 3, x: 230, y: 200, r: 35, fill: '#ff2f5F'},
  {id: 4, x: 300, y: 140, r: 80, fill: '#9f20FF'},
  {id: 5, x: 380, y: 170, r: 24, fill: '#00f2FF'},
  {id: 6, x: 580, y: 70, r: 14, fill: '#3fff40'},
]

type Data = {
  id: number;
  x: number;
  y: number;
  r: number;
  fill: string;
}
type SVG = typeof svg

const plot = (data: Data[], svg: SVG) => {
  const t = transition()
    .duration(200)
    .ease(easeElasticInOut
      .amplitude(0.5)
      .period(0.3)
    )

  svg
    .selectAll("circle")
    .data(
      data, 
      d => (d as Data).id // specify the key (ordering)
    )
    .join(
      enter => enter.append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 0)
        .call(
          selection => selection.transition(t)
            .delay((_, i) => i * 30)
            .attr('r', d => d.r)
        ),
      update => update.call(
        selection => selection.transition(t)
          // .delay((_, i) => i * 30)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', d => d.r)
      ), // transitions 
      exit => exit.transition(t)
        .attr('r', 0)
        .remove() // invoked when data is []
    )
    .attr('fill', d => d.fill)
    .attr('opacity', 0.8)
} 

plot(data, svg)

const button = document.querySelector<HTMLButtonElement>('button')!

button.addEventListener('click', () => {
    const newData = data.map((data) => ({
      ...data,  
      r: randomNormal(50, 20)(),
      x: randomNormal(400, 200)(),
      y: randomNormal(300, 100)(),
    }))
    .slice(randomInt(0, data.length)())
    // console.log(newData)
    plot(newData, svg)
})
