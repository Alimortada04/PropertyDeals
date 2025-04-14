              {/* Location Section */}
              <Accordion type="single" defaultValue="location" collapsible className="w-full">
                <AccordionItem value="location" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">📍</span>
                      <span>Location</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    {/* 2x4 Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Row 1-2, Column 1: Map - spans 1 column and 2 rows */}
                      <div className="row-span-2">
                        <h4 className="font-medium mb-3 text-[#09261E]">Map</h4>
                        <div className="rounded-lg overflow-hidden bg-gray-100 h-[300px] flex items-center justify-center">
                          <div className="text-center">
                            <MapPinned className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <Button variant="outline" className="bg-white">View on Map</Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Row 1-2, Column 2: Home Values & Housing Ownership - spans 1 column and 2 rows */}
                      <div className="row-span-2 space-y-4">
                        {/* Home Values */}
                        <div className="rounded-lg bg-gray-50 p-4">
                          <h4 className="font-medium mb-3 text-[#09261E]">Home Values</h4>
                          <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                            {demographicData.homeValues.map((item, index) => (
                              <div 
                                key={index}
                                className="h-full float-left" 
                                style={{
                                  width: `${item.percentage}%`,
                                  backgroundColor: [
                                    'rgba(19, 83, 65, 0.95)', // dark green (primary)
                                    'rgba(19, 83, 65, 0.8)',  // medium green
                                    'rgba(19, 83, 65, 0.65)', // light green
                                    'rgba(128, 51, 68, 0.65)', // light wine
                                    'rgba(128, 51, 68, 0.8)',  // medium wine
                                    'rgba(128, 51, 68, 0.95)'  // dark wine (secondary)
                                  ][index % 6]
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            {demographicData.homeValues.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: [
                                      'rgba(19, 83, 65, 0.95)', // dark green (primary)
                                      'rgba(19, 83, 65, 0.8)',  // medium green
                                      'rgba(19, 83, 65, 0.65)', // light green
                                      'rgba(128, 51, 68, 0.65)', // light wine
                                      'rgba(128, 51, 68, 0.8)',  // medium wine
                                      'rgba(128, 51, 68, 0.95)'  // dark wine (secondary)
                                    ][index % 6]
                                  }}
                                />
                                <span>{item.group}: {item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Housing Ownership */}
                        <div className="rounded-lg bg-gray-50 p-4 mt-4">
                          <h4 className="font-medium mb-3 text-[#09261E]">Housing Ownership</h4>
                          <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                            {demographicData.ownershipType.map((item, index) => (
                              <div 
                                key={index}
                                className="h-full float-left" 
                                style={{
                                  width: `${item.percentage}%`,
                                  backgroundColor: [
                                    'rgba(19, 83, 65, 0.95)', // dark green
                                    'rgba(19, 83, 65, 0.75)', // medium green
                                    'rgba(128, 51, 68, 0.75)', // medium wine
                                    'rgba(229, 159, 159, 0.8)'  // salmon
                                  ][index]
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            {demographicData.ownershipType.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: [
                                      'rgba(19, 83, 65, 0.95)', // dark green
                                      'rgba(19, 83, 65, 0.75)', // medium green
                                      'rgba(128, 51, 68, 0.75)', // medium wine
                                      'rgba(229, 159, 159, 0.8)'  // salmon
                                    ][index]
                                  }}
                                />
                                <span>{item.group}: {item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Row 3, Columns 1-2: Monthly Rent Costs - spans 2 columns and 1 row */}
                      <div className="col-span-2">
                        <h4 className="font-medium mb-3 text-[#09261E]">Monthly Rent Costs</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {demographicData.monthlyRent.map((item, index) => (
                            <div key={index} className="border rounded-md bg-white p-4">
                              <div className="text-sm text-gray-500 mb-1">{item.type}</div>
                              <div className="font-semibold text-lg">${item.rent}/mo</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Row 4, Columns 1-2: Year Housing Built - spans 2 columns and 1 row, converted to vertical bar chart */}
                      <div className="col-span-2">
                        <h4 className="font-medium mb-3 text-[#09261E]">Year Housing Was Built</h4>
                        <div className="grid grid-cols-9 gap-1 h-[180px] items-end">
                          {demographicData.yearBuilt.map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className="w-full rounded-t-sm"
                                style={{ 
                                  height: `${Math.max(15, item.percentage * 3)}%`,
                                  backgroundColor: [
                                    'rgba(19, 83, 65, 0.95)', // darkest
                                    'rgba(19, 83, 65, 0.90)',
                                    'rgba(19, 83, 65, 0.85)', 
                                    'rgba(19, 83, 65, 0.80)',
                                    'rgba(19, 83, 65, 0.75)', 
                                    'rgba(19, 83, 65, 0.70)',
                                    'rgba(19, 83, 65, 0.65)',
                                    'rgba(19, 83, 65, 0.60)',
                                    'rgba(19, 83, 65, 0.55)'
                                  ][index]
                                }}
                              />
                              <div className="text-xs text-center mt-2 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '100%', transform: 'rotate(-45deg)', transformOrigin: 'left top', fontSize: '10px' }}>
                                {item.group}
                              </div>
                              <div className="text-xs font-medium mt-1">{item.percentage}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Demographics Section */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="demographics" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">👥</span>
                      <span>Demographics</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="space-y-6">
                      {/* Population */}
                      <div>
                        <h4 className="font-medium mb-3 text-[#09261E]">Population</h4>
                        <div className="p-4 border rounded-lg bg-white">
                          <div className="text-3xl font-bold text-[#09261E]">{demographicData.population.toLocaleString()}</div>
                          <div className="text-sm text-gray-500 mt-1">Total residents in area</div>
                        </div>
                      </div>
                      
                      {/* Household Income */}
                      <div>
                        <h4 className="font-medium mb-3 text-[#09261E]">Household Income</h4>
                        <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                          {demographicData.householdIncome.map((item, index) => (
                            <div 
                              key={index}
                              className="h-full float-left" 
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: [
                                  'rgba(128, 51, 68, 0.95)', // dark wine 
                                  'rgba(128, 51, 68, 0.80)', 
                                  'rgba(128, 51, 68, 0.65)',
                                  'rgba(19, 83, 65, 0.75)', // medium green
                                  'rgba(19, 83, 65, 0.95)'  // dark green
                                ][index % 5]
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                          {demographicData.householdIncome.map((item, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <div 
                                className="w-3 h-3 rounded-full mr-1"
                                style={{
                                  backgroundColor: [
                                    'rgba(128, 51, 68, 0.95)', // dark wine 
                                    'rgba(128, 51, 68, 0.80)', 
                                    'rgba(128, 51, 68, 0.65)',
                                    'rgba(19, 83, 65, 0.75)', // medium green
                                    'rgba(19, 83, 65, 0.95)'  // dark green
                                  ][index % 5]
                                }}
                              />
                              <span>{item.group}: {item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Educational Attainment and Age Distribution - Side by Side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Educational Attainment - Pie Chart */}
                        <div>
                          <h4 className="font-medium mb-3 text-[#09261E]">Educational Attainment</h4>
                          <div className="relative w-full aspect-square max-w-[200px] mx-auto">
                            {/* Create pie chart using conic-gradient */}
                            <div 
                              className="w-full h-full rounded-full"
                              style={{ 
                                background: `conic-gradient(
                                  rgba(19, 83, 65, 0.95) 0% ${demographicData.educationalAttainment[0].percentage}%, 
                                  rgba(19, 83, 65, 0.75) ${demographicData.educationalAttainment[0].percentage}% ${demographicData.educationalAttainment[0].percentage + demographicData.educationalAttainment[1].percentage}%, 
                                  rgba(19, 83, 65, 0.55) ${demographicData.educationalAttainment[0].percentage + demographicData.educationalAttainment[1].percentage}% ${demographicData.educationalAttainment[0].percentage + demographicData.educationalAttainment[1].percentage + demographicData.educationalAttainment[2].percentage}%, 
                                  rgba(128, 51, 68, 0.75) ${demographicData.educationalAttainment[0].percentage + demographicData.educationalAttainment[1].percentage + demographicData.educationalAttainment[2].percentage}% ${demographicData.educationalAttainment[0].percentage + demographicData.educationalAttainment[1].percentage + demographicData.educationalAttainment[2].percentage + demographicData.educationalAttainment[3].percentage}%,
                                  rgba(128, 51, 68, 0.95) ${demographicData.educationalAttainment[0].percentage + demographicData.educationalAttainment[1].percentage + demographicData.educationalAttainment[2].percentage + demographicData.educationalAttainment[3].percentage}% 100%
                                )`
                              }}
                            />
                            {/* Center hole to create donut */}
                            <div className="absolute top-1/2 left-1/2 w-[40%] h-[40%] bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                          </div>
                          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                            {demographicData.educationalAttainment.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: index < 3 
                                    ? [
                                        'rgba(19, 83, 65, 0.95)',
                                        'rgba(19, 83, 65, 0.75)',
                                        'rgba(19, 83, 65, 0.55)'
                                      ][index]
                                    : [
                                        'rgba(128, 51, 68, 0.75)',
                                        'rgba(128, 51, 68, 0.95)'
                                      ][index - 3]
                                  }}
                                />
                                <span>{item.group}: {item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Age Distribution - Pie Chart */}
                        <div>
                          <h4 className="font-medium mb-3 text-[#09261E]">Age Distribution</h4>
                          <div className="relative w-full aspect-square max-w-[200px] mx-auto">
                            {/* Create pie chart using conic-gradient */}
                            <div 
                              className="w-full h-full rounded-full"
                              style={{ 
                                background: `conic-gradient(
                                  rgba(19, 83, 65, 0.95) 0% ${demographicData.ageDistribution[0].percentage}%, 
                                  rgba(128, 51, 68, 0.90) ${demographicData.ageDistribution[0].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage}%, 
                                  rgba(128, 51, 68, 0.80) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage}%, 
                                  rgba(128, 51, 68, 0.70) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage}%,
                                  rgba(128, 51, 68, 0.60) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage + demographicData.ageDistribution[4].percentage}%,
                                  rgba(128, 51, 68, 0.50) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage + demographicData.ageDistribution[4].percentage}% 100%
                                )`
                              }}
                            />
                            {/* Center hole to create donut */}
                            <div className="absolute top-1/2 left-1/2 w-[40%] h-[40%] bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                          </div>
                          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                            {demographicData.ageDistribution.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: index === 0 
                                    ? 'rgba(19, 83, 65, 0.95)' // Under 18 - Green
                                    : [
                                      'rgba(128, 51, 68, 0.90)', 
                                      'rgba(128, 51, 68, 0.80)', 
                                      'rgba(128, 51, 68, 0.70)', 
                                      'rgba(128, 51, 68, 0.60)', 
                                      'rgba(128, 51, 68, 0.50)'
                                    ][(index - 1) % 5]
                                  }}
                                />
                                <span>{item.group}: {item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Gender Distribution */}
                      <div>
                        <h4 className="font-medium mb-3 text-[#09261E]">Gender Distribution</h4>
                        <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                          {demographicData.genderDistribution.map((item, index) => (
                            <div 
                              key={index}
                              className="h-full float-left" 
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: index === 0 ? 'rgba(19, 83, 65, 0.9)' : 'rgba(128, 51, 68, 0.9)'
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                          {demographicData.genderDistribution.map((item, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <div 
                                className="w-3 h-3 rounded-full mr-1"
                                style={{
                                  backgroundColor: index === 0 ? 'rgba(19, 83, 65, 0.9)' : 'rgba(128, 51, 68, 0.9)'
                                }}
                              />
                              <span>{item.group}: {item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>