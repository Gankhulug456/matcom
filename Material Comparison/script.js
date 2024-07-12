document.addEventListener('DOMContentLoaded', function() {
    const svg = d3.select('#material-comparison');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().range([0, chartWidth]);
    const yScale = d3.scaleLinear().range([chartHeight, 0]);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const materials = [
        { name: 'PPS-CF10', tensile_strength: 56.06, thermal_resistance: 252.5 },
        { name: 'PET-CF17', tensile_strength: 65.87, thermal_resistance: 147.5 },
        { name: 'PETG-rCF08', tensile_strength: 59.76, thermal_resistance: 68.6 },
        { name: 'PA6-CF20', tensile_strength: 109.72, thermal_resistance: 215 },
        { name: 'PA12-CF10', tensile_strength: 77.36, thermal_resistance: 131 },
        { name: 'PA612-CF15', tensile_strength: 91.91, thermal_resistance: 175 },
        { name: 'PA6-GF25', tensile_strength: 80.99, thermal_resistance: 191 },
        { name: 'PETG-ESD', tensile_strength: 36.05, thermal_resistance: 76 }
    ];

    const xAxisGroup = g.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .attr('class', 'axis');
    const yAxisGroup = g.append('g')
        .attr('class', 'axis');

    const xGrid = g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${chartHeight})`);
    const yGrid = g.append('g')
        .attr('class', 'grid');

    const xLabel = g.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', chartHeight + margin.bottom - 10)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle');
    const yLabel = g.append('text')
        .attr('x', -chartHeight / 2)
        .attr('y', -margin.left + 20)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle');

    function updateChart(xProp, yProp) {
        xScale.domain([0, d3.max(materials, d => d[xProp]) + 10]);
        yScale.domain([0, d3.max(materials, d => d[yProp]) + 10]);

        const xAxisCall = d3.axisBottom(xScale);
        const yAxisCall = d3.axisLeft(yScale);

        xAxisGroup.transition().duration(1000).call(xAxisCall);
        yAxisGroup.transition().duration(1000).call(yAxisCall);

        const xGridCall = d3.axisBottom(xScale).tickSize(-chartHeight).tickFormat('');
        const yGridCall = d3.axisLeft(yScale).tickSize(-chartWidth).tickFormat('');

        xGrid.transition().duration(1000).call(xGridCall);
        yGrid.transition().duration(1000).call(yGridCall);

        xLabel.text(d3.select(`#x-axis option[value=${xProp}]`).text());
        yLabel.text(d3.select(`#y-axis option[value=${yProp}]`).text());

        const circles = g.selectAll('circle').data(materials, d => d.name);

        circles.enter().append('circle')
            .attr('cx', d => xScale(d[xProp]))
            .attr('cy', d => yScale(d[yProp]))
            .attr('r', 10)
            .attr('fill', '#d0f700')
            .merge(circles)
            .transition().duration(1000)
            .attr('cx', d => xScale(d[xProp]))
            .attr('cy', d => yScale(d[yProp]));

        circles.exit().remove();

        const labels = g.selectAll('.label').data(materials, d => d.name);

        labels.enter().append('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d[xProp]))
            .attr('y', d => yScale(d[yProp]) - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .text(d => d.name)
            .merge(labels)
            .transition().duration(1000)
            .attr('x', d => xScale(d[xProp]))
            .attr('y', d => yScale(d[yProp]) - 15)
            .text(d => d.name);

        labels.exit().remove();
    }

    updateChart('tensile_strength', 'thermal_resistance');

    document.getElementById('x-axis').addEventListener('change', function() {
        const xProp = this.value;
        const yProp = document.getElementById('y-axis').value;
        updateChart(xProp, yProp);
    });

    document.getElementById('y-axis').addEventListener('change', function() {
        const yProp = this.value;
        const xProp = document.getElementById('x-axis').value;
        updateChart(xProp, yProp);
    });
});
